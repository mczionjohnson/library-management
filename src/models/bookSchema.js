import mongoose from "mongoose";

const bookSchema = mongoose.Schema(
  {
    // mongoose.Schema.Types.ObjectId tells model that users is another table in the collection
    // the ref states the table
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: "Users",
    // },
    title: {
      type: String,
    },
    author: {
      type: String,
    },
    ISBN: {
      type: String,
      required: true,
      unique: true,
    },
    borrowed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
//you missed this line, this will search in all fields
// postSchema.index({'$**': 'text'});
// or if you need to search in specific field then replace it by:
// bookSchema.index({title: 'text'});

const Book = mongoose.model("Book", bookSchema);
export default Book;
