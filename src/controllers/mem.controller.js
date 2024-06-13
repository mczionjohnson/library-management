import logger from "../logger/logger.js";
import dotenv from "dotenv";


import User from "../models/userSchema.js";

dotenv.config();

export const memSignup = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  
  const name = req.body.name;
  const email = req.body.email;
  const libPass = req.body.libPass;


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
  if (!libPass) {
    return res.status(400).json({ message: "Enter your library pass" });
  }

  const libSecret = process.env.LIB_SECRET;

  if (libPass != libSecret) {
    return res.status(400).json({ message: "unauthorized" });
  }

  const payload = {};
  if (name) {
    payload.name = name;
  }
  if (email) {
    payload.email = email;
  }
  // logger.info(payload);

  const user = new User({
    ...payload,
  });
  const savedUser = await user.save();
  // logger.info(savedUser);

  res.json({ message: "Success", savedUser });
};

// export const memLogin = async (req, res) => {
//   res.setHeader("Content-Type", "application/json");

//   const email = req.body.email;
//   const password = req.body.password;

//   if (!email) {
//     return res.status(400).json({ message: "Enter email" });
//   }
//   if (!password) {
//     return res.status(400).json({ message: "Enter password" });
//   }
//   const user = await User.findOne({ email });
//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }
//   const checkPassword = await user.isValidPassword(password);
//   if (checkPassword == false) {
//     return res.status(401).json({ message: "Password is incorrect" });
//   } else {
//     const secret = process.env.JWT_SECRET;
//     const token = Jwt.sign(
//       {
//         email: user.email,
//         _id: user._id,
//       },
//       secret,
//       { expiresIn: "1hr" }
//     );
//     //   logger.info(token);
//     return res.json({ token });
//   }
// };
