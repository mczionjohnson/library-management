import { Router } from "express";
import logger from "../logger/logger.js";

import Book from "../models/bookSchema.js";
import User from "../models/userSchema.js";

import * as userController from "../controllers/book.controller.js";

import jwt from "jsonwebtoken";
import checkAuth from "../middleware/auth.middleware.js";

const bookRouter = Router();

// all users can visit this 2 routes
bookRouter.get("/", userController.getAllBooks);

bookRouter.get("/:bookId", async (req, res) => {
  const { bookId } = req.params;

  try {
    const singleBook = await Book.findOne({
      _id: bookId,
    });

    res.status(200).json({ message: "viewing a book", Book: singleBook });
    // logger.info(`Success: ${email} viewed a book`);
  } catch {
    res.status(404).json({ message: "not found" });
  }
});


bookRouter.post("/:bookId/borrow", async (req, res) => {
  try {
    const { bookId } = req.params;

    let token = req.headers.authorization;

    if (!token) {
      res.json("No token provided");
    }
    if (token) {
      token = token.split(" ")[1];

      // SECRET is stored in .env
      jwt.verify(token, process.env.JWT_SECRET, async (err, authToken) => {

        if (err) {
          return res.status(401).json({ message: "Unauthorized4" });
        } else {
          const email = authToken.email;
          // logger.info(authToken)
          let user = await User.findOne({ email });

          const loggedUserId = user._id;
          console.log(user.myArray.length);

          // check if book is saved
          const singleBook = await Book.findOne({
            _id: bookId,
          });
          if (singleBook == null) {
            return res.status(404).json({ message: "not found" });
          }
          console.log(singleBook);

          // check if book is available
          if (singleBook.borrowed == true) {
            return res.status(423).json({
              message:
                "the book has been borrowed, check back later, Thank you",
            });
          }
          console.log(singleBook.borrowed);

          // check if user has 3 books already
          if (user.myArray.length > 2) {
            return res.status(423).json({
              message:
                "You have already borrowed 3 books, kindly return one then try again.",
            });
          }

          // update book
          const borrowedBook = await Book.findOneAndUpdate(
            { _id: bookId },
            { borrowed: true }
          );

          console.log(borrowedBook.borrowed);

          // // find user and add book to the array
          await User.findOneAndUpdate(
            { _id: loggedUserId },
            {
              $push: { myArray: { bookId } },
            }
          );

          // confirm the update
          const update = await User.findOne({ _id: loggedUserId });
          console.log(update);

          res.status(200).json({ message: "Book borrowed", borrowedBook });
          // logger.info(`Success: ${user.email} posted a book`);
        }
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });

    // res.status(404).json({ message: "not found" });
  }
});

bookRouter.post("/:bookId/return", async (req, res) => {
  try {
    const { bookId } = req.params;

    let token = req.headers.authorization;

    if (!token) {
      res.json("No token provided");
    }

    if (token) {
      token = token.split(" ")[1];

      // SECRET is stored in .env
      jwt.verify(token, process.env.JWT_SECRET, async (err, authToken) => {
        if (err) {
          return res.status(401).json({ message: "Unauthorized4" });
        } else {
          const email = authToken.email;
          // logger.info(authToken)

          let user = await User.findOne({ email });

          const loggedUserId = user._id;

          console.log(user.myArray.length);

          // check if book is saved
          const singleBook = await Book.findOne({
            _id: bookId,
          });
          if (singleBook == null) {
            return res.status(404).json({ message: "not found" });
          }
          console.log(singleBook);

          // check if user borrowed the book
          const array = user.myArray;
          const parameter = bookId;

          const thisBook = array.filter((val) =>
            val.bookId.includes(parameter)
          );

          console.log(thisBook);

          if (!thisBook) {
            return res.status(423).json({
              message: "You cannot return a book you did not borrow, Thank you",
            });
          }
          if (thisBook) {
            //  // some jokes
            // if (thisBook.borrowed == false) {
            //   // check if book is borrowed by user
            //   return res.status(423).json({
            //     message:
            //       "You stole this book from the Library? How dare you!",
            //   });
            // }
            // console.log(thisBook.borrowed);

            // update book
            const borrowedBook = await Book.findOneAndUpdate(
              { _id: bookId },
              { borrowed: false }
            );

            console.log(borrowedBook.borrowed);

            // stop

            // find user and remove the book from user's array
            await User.findOneAndUpdate(
              { _id: loggedUserId },
              {
                $pull: { myArray: { bookId } },
              }
            );

            // confirm the update
            const update = await User.findOne({ _id: loggedUserId });
            console.log(update);

            res.status(200).json({ message: "Book returned", borrowedBook });
            //   // logger.info(`Success: ${user.email} posted a book`);
          }
        }
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });

    // res.status(404).json({ message: "not found" });
  }
});
export default bookRouter;
