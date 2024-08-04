import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import { User } from "./schema/userSchema.js";

//Loading env variables
dotenv.config();

//creating express app
const app = express();

//middleware
app.use(cors());
app.use(express.json());

//getting env variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = "cognito1234" || process.env.JWT_SECRET;

//connect mongo
mongoose.connect(MONGO_URI).then(() => {
  console.log("mongodb connected");
});
app.post(
  "/register",
  // Validation middleware
  body("username")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role").notEmpty().withMessage("Role is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, email, password, role } = req.body;

      // Check if the email is already in use
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).send({ error: "Email already in use" });
      }

      // Hash the password before saving the user
      const hashedPassword = await bcrypt.hash(password, 8);

      // Create a new user with the hashed password
      const user = new User({
        username,
        email,
        password: hashedPassword,
        role,
      });

      // Save the user to the database
      await user.save();

      // Generate a token
      const token = jwt.sign({ id: user._id }, JWT_SECRET);

      res.status(201).send({ user, token });
    } catch (error) {
      console.error(error); // Log the error
      res.status(400).send(error);
    }
  }
);
// Login route
app.post(
  "/login",
  // Validation middleware
  body("username").notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, password } = req.body;

      // Find user by username
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).send({ error: "Invalid login credentials" });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send({ error: "Invalid login credentials" });
      }

      // Generate token
      const token = jwt.sign({ id: user._id }, JWT_SECRET);

      res.send({ message: "Login successful", user, token });
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
      res.status(500).send({ error: "An error occurred during login" });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
