import { Router } from "express";
import logger from "../logger/logger.js";

import Book from "../models/bookSchema.js";
import User from "../models/userSchema.js";
import * as userController from "../controllers/book.controller.js";

import jwt from "jsonwebtoken";
import checkAuth from "../middleware/auth.middleware.js";

const bookRouter = Router();

bookRouter.get("/", userController.getAllBooks);

// move to userController
bookRouter.get("/:bookId", async (req, res) => {
  const { bookId } = req.params;

  try {
    const singleBook = await Book.findOne({
      _id: bookId,
    });

    res.status(200).json({ message: "viewing a book", Book: singleBook });
    // logger.info(`Success: ${email} viewed a blog`);
  } catch {
    res.status(404).json({ message: "not found" });
  }
});

bookRouter.post("/:bookId/borrow", async (req, res) => {
  try {
    const { bookId } = req.params;

    let token = req.headers.authorization;
    token = token.split(" ")[1];

    if (!token) {
      res.json("No token provided");
    }
    if (token) {
      // SECRET is stored in .env
      jwt.verify(token, process.env.JWT_SECRET, async (err, authToken) => {
        const email = authToken.email;
        // logger.info(authToken)
        if (err) {
          res.redirect("/");
        } else {
          let user = await User.findOne({ email });

          const loggedUserId = user._id;

          // book is saved and available
          const singleBook = await Book.findOne({
            _id: bookId,
          });
          if (singleBook == null) {
            return res.status(404).json({ message: "not found" });
          }
          console.log(singleBook);

          if (singleBook.borrowed == true) {
            return res.status(423).json({
              message:
                "the book has been borrowed, check back later, Thank you",
            });
          }
          console.log(singleBook.borrowed);

          // update book
          const borrowedBook = await Book.findOneAndUpdate(
            { _id: bookId },
            { borrowed: true }
          );

          console.log(borrowedBook);

          // find user and add book borrowed
          await User.findOneAndUpdate(
            { _id: loggedUserId },
            { myArray: bookId }
          );

          res.status(200).json({ message: "Book borrowed", borrowedBook });
          // logger.info(`Success: ${user.email} posted a blog`);
        }
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });

    // res.status(404).json({ message: "not found" });
  }
});
export default bookRouter;
