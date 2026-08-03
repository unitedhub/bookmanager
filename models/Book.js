import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 200,
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
      maxlength: 150,
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["want-to-read", "reading", "completed"],
      default: "want-to-read",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Book || mongoose.model("Book", BookSchema);
