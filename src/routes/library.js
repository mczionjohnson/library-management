import { Router } from "express";
import logger from "../logger/logger.js";

import Book from "../models/bookSchema.js";
import User from "../models/userSchema.js";


import jwt from "jsonwebtoken";

const libRouter = Router();

// only librarian can use this 3 routes
libRouter.post("/", async (req, res) => {
  let token = req.headers.authorization;

  if (!token) {
    res.json("No token provided");
  }
  try {
    if (token) {
      token = token.split(" ")[1];

      // SECRET is stored in .env
      jwt.verify(token, process.env.JWT_SECRET, async (err, authToken) => {
        if (err) {
          return res.status(401).json({ message: "Unauthorized" });
        } else {
          const email = authToken.email;
          // logger.info(authToken)

          let user = await User.findOne({
            $and: [{ email: email }, { role: "library" }],
          });

          // logger.info(user);
          if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
          }

          const { title, author, ISBN } = req.body;

          const book = new Book({
            title: title,
            author: author,
            ISBN: ISBN,
          });

          const savedBook = await book.save();

          res.status(200).json({ message: "Book saved", savedBook });
          logger.info(`Success: ${user.email} saved a book`);
        }
      });
    }
  } catch (error) {
    // logger.error(error.message);
    res.json({ message: "Unsuccesful" });
  }
});

libRouter.patch("/:bookId", async (req, res) => {
  const { bookId } = req.params;

  let token = req.headers.authorization;

  if (!token) {
    res.json("No token provided");
  }
  try {
    if (token) {
      token = token.split(" ")[1];

      // SECRET is stored in .env
      jwt.verify(token, process.env.JWT_SECRET, async (err, authToken) => {
        if (err) {
          return res.status(401).json({ message: "Unauthorized" });
        } else {
          const email = authToken.email;
          let user = await User.findOne({
            $and: [{ email: email }, { role: "library" }],
          });

          if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
          }

          // check if the book is borrowed
          let book = await Book.findOne({ _id: bookId });

          if (!book) {
            return res.status(400).json({ message: "Book not found" });
          } else if (book.borrowed == true) {
            return res.status(400).json({ message: "Book has been borrowed" });
          } else {
            const { title, author, ISBN } = req.body;
            const payload = {};
            if (title) {
              payload.title = title;
            }
            if (author) {
              payload.author = author;
            }
            if (ISBN) {
              payload.ISBN = ISBN;
            }
            const updatedBook = await Book.findOneAndUpdate(
              { _id: bookId },
              payload,
              {
                new: true,
              }
            );
            // logger.info(`Success: ${user.email} updated a book`);
            res
              .status(200)
              .json({ message: "Book Updated", Book: updatedBook });
          }
        }
      });
    }
  } catch (error) {
    // logger.error(error.message);
    res.json({ message: "Unsuccesful" });
  }
});

libRouter.delete("/:bookId", async (req, res) => {
  const { bookId } = req.params;

  let token = req.headers.authorization;
  token = token.split(" ")[1];

  if (!token) {
    res.json("No token provided");
  }
  try {
    if (token) {
      // SECRET is stored in .env
      jwt.verify(token, process.env.JWT_SECRET, async (err, authToken) => {
        if (err) {
          return res.status(401).json({ message: "Unauthorized" });
        } else {
          const email = authToken.email;

          let user = await User.findOne({
            $and: [{ email: email }, { role: "library" }],
          });

          if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
          }
          try {
            const singleBook = await Book.findOne({ _id: bookId });
            if (!singleBook) {
              res.status(500).json("Book not found, probably wrong ID");
            }
            if (singleBook.borrowed == true) {
              return res
                .status(400)
                .json({ message: "Book has been borrowed" });
            } else {
              const deletedBook = await Book.deleteOne({
                _id: bookId,
              });
              res.json({ message: "Book Deleted", deletedBook });
              // logger.info(`Success: ${user.email} deleted a book`);
            }
          } catch (error) {
            console.log(error.message);
            res.status(500).json("book not found");
          }

          // if (!singleBook) {
          //   res.json("Book not found, probably wrong ID");
          // }
          // if (singleBook.borrowed == true) {
          //   return res.status(400).json({ message: "Book has been borrowed" });
          // } else {
          //   const deletedBook = await Book.deleteOne({
          //     _id: bookId,
          //   });
          //   res.json({ message: "Book Deleted", deletedBook });
          //   // logger.info(`Success: ${user.email} deleted a book`);
          // }
        }
      });
    }
  } catch (error) {
    // logger.error(error.message);
    console.log(error.message);
    res.status(500).json({ message: "Unsuccesful" });
  }
});

export default libRouter;
