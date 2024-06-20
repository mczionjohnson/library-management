import logger from "../logger/logger.js";
import dotenv from "dotenv";

import User from "../models/userSchema.js";


import Jwt from "jsonwebtoken";

dotenv.config();

export const memSignup = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const checkUser = await User.findOne({ email });
  if (checkUser) {
    res.status(400);
    res.json("User already exists");
    return;
  }
  if (!name) {
    return res.status(400).json({ message: "Enter name" });
  }
  if (!email) {
    return res.status(400).json({ message: "Enter email" });
  }
  if (!password) {
    return res.status(400).json({ message: "Enter password" });
  }

  const payload = {};
  if (name) {
    payload.name = name;
  }
  if (email) {
    payload.email = email;
  }
  if (password) {
    payload.password = password;
  }

  const user = new User({
    ...payload,
  });
  const libUser = new Lib({
    ...payload,
  });

  const savedUser = await user.save();


  res.json({ message: "Success", savedUser });
};

export const memLogin = async (req, res) => {
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
