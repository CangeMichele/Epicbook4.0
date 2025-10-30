import {Schema, model} from "mongoose";

const bookSchema = new Schema(
    {
    asin: {
      type: String,
      required: true,
      unique: true
    },
    title: {
      type: String,
      required: true
    },
    img: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      enum:["fantasy", "history", "horror", "romance", "scifi"],
      required: true
    }

  },
  
  {
    collection : "Epicbook"
  }
);
  
  const Book = model("Book", bookSchema);
  
export default Book;