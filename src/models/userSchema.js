import mongoose from "mongoose";

import bcrypt from "bcrypt";

// const subSchema = new mongoose.Schema({
//   _id: mongoose.Schema.Types.ObjectId,
// });

const userSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "library"],
  },

  myArray: { type: Array, default: [] },
  // borrowedBooks: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   default: null,
  //   ref: "Book",
  // },
});

// The code in the UserScheme.pre() function is called a pre-hook.
// Before the user information is saved in the database, this function will be called,
// you will get the plain text password, hash it, and store it.
userSchema.pre("save", async function (next) {
  const user = this;
  const hash = await bcrypt.hash(this.password, 10);

  this.password = hash;
  next();
});

// You will also need to make sure that the user trying to log in has the correct credentials. Add the following new method:
userSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
};

// module.exports= mongoose.model("Users", UserSchema);
const User = mongoose.model("User", userSchema);
export default User;
