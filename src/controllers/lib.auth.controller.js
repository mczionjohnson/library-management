import dotenv from "dotenv";

import logger from "../logger/logger.js";

import User from "../models/userSchema.js";
import Jwt from "jsonwebtoken";

dotenv.config();

export const libSignup = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const email = req.body.email;
  const password = req.body.password;
  const libPass = req.body.libPass;

  const checkUser = await User.findOne({ email });
  if (checkUser) {
    res.status(400);
    res.json("User already exists");
    return;
  }


  if (!email) {
    return res.status(400).json({ message: "Enter email" });
  }
  if (!password) {
    return res.status(400).json({ message: "Enter password" });
  }
  if (!libPass) {
    return res.status(400).json({ message: "Enter your Library Pass" });
  }
  
  const libSecret = process.env.LIB_SECRET;


  if (libPass != libSecret) {
    return res.status(400).json({ message: "unauthorized" });
  }

  const payload = {};
  if (email) {
    payload.email = email;
  }
  if (password) {
    payload.password = password;
  }
  if (libPass) {
    payload.role = "library";
  }
  // logger.info(payload);

  const user = new User({
    ...payload,
  });
  const savedUser = await user.save();
  // logger.info(savedUser);

  res.json({ message: "Success", savedUser });
};

export const libLogin = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const email = req.body.email;
  const password = req.body.password;

  if (!email) {
    return res.status(400).json({ message: "Enter email" });
  }
  if (!password) {
    return res.status(400).json({ message: "Enter password" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const checkPassword = await user.isValidPassword(password);
  
  if (checkPassword == false) {
    return res.status(401).json({ message: "Password is incorrect" });
  } else if (user.role != "library") {
    return res.status(401).json({ message: "unauthorised" });
  } else {
    const secret = process.env.JWT_SECRET;
    const token = Jwt.sign(
      {
        email: user.email,
        _id: user._id,
      },
      secret,
      { expiresIn: "1hr" }
    );
    //   logger.info(token);
    return res.json({ token });
  }
};
