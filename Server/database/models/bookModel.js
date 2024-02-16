import mongoose from "mongoose";

const critiqueSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  bookId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 1000,
  },
  stars: {
    type: Number,
    required: false,
    min: 0,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const favoriteSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  bookId: {
    type: String,
    required: true,
  },
});

const likeSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  bookId: {
    type: String,
    required: true,
  },
});

const bookSchema = mongoose.Schema({
  likes: [likeSchema],
  favorites: [favoriteSchema],
  critiques: [critiqueSchema],
});

const BookModel = mongoose.model("Book", bookSchema);
export default BookModel;
