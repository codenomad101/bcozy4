import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    notes: [
      {
        noteName: { type: String },
        title: { type: String },
        description: { type: String },
      },
      { timestamps: true },
    ],
    role: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create models
const User = mongoose.model("User", userSchema);

export { User };
