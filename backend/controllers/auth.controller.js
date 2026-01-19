// backend/controllers/auth.controller.js
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const cookieOptions = () => {
  // For production (cross-site), we must set sameSite: 'none' and secure: true.
  // For development on localhost, use 'lax' and secure: false.
  if (process.env.NODE_ENV === "production") {
    return {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    };
  }
  return {
    httpOnly: true,
    maxAge: 3 * 24 * 60 * 60 * 1000,
    sameSite: "lax",
    secure: false,
  };
};

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(401).json({ message: "Email already exists" });
    }

    if (password.length < 6) {
      return res.status(401).json({ message: "At least 6 characters are required" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashPassword,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("jwt_social", token, cookieOptions());

    res.status(201).json({ message: "User signed up successfully", user: { ...user.toObject(), password: undefined }, token });
  } catch (error) {
    console.log("Error in signUp Controller", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingEmail = await User.findOne({ email });

    if (!existingEmail) {
      return res.status(401).json({ message: "User does not exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingEmail.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Password is invalid" });
    }

    const token = jwt.sign({ userId: existingEmail._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("jwt_social", token, cookieOptions());

    res.status(200).json({ message: "User signed in successfully", token });
  } catch (error) {
    console.log("Error in signIn Controller", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie("jwt_social", { sameSite: "lax", secure: false });
    res.status(200).json({ message: "User signed out successfully" });
  } catch (error) {
    console.log("Error in signOut Controller", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    // protectRoute should have set req.user
    res.json(req.user);
  } catch (error) {
    console.log("Error in getCurrentUser Controller", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAllInterns = async (req, res) => {
  try {
    const users = await User.find({ role: "User" }).select("-password");
    res.json(users);
  } catch (error) {
    console.log("Error in getAllInterns Controller", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
