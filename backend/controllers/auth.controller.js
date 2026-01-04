import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password ) {
      return res.status(400).json({ message: "All fileds are required" });
    }

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(401).json({ message: "Email is already exits" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    if (password.length < 6) {
      return res.status(401).json({ message: "at least 6 Char are required" });
    }

    const user = new User({
      name,
      email,
      password: hashPassword,
      
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("jwt_social", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    await user.save();

    res.status(201).json({ message: "User signUp successffuly", user, token });
  } catch (error) {
    console.log("Error in Signup Controller", error.message);
    res.status(500).json({ message: "Server Error " });
  }
};
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if ((!email, !password)) {
      return res.status(400).json({ message: "All fileds are required" });
    }

    const exisitingEmail = await User.findOne({ email });

    if (!exisitingEmail) {
      return res.status(401).json({ message: "Username is not exits" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      exisitingEmail.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Password is Invalid" });
    }

    const token = jwt.sign(
      { userId: exisitingEmail._id },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    res.cookie("jwt_social", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ message: "User Signup successffuly", token });
  } catch (error) {
    console.log("Error in SignIn Controller", error.message);
    res.status(500).json({ message: "Server Error " });
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie("jwt_social");
    res.status(201).json({ message: "User SignOut Succesfully" });
  } catch (error) {
    console.log("Error in SignOut Controller", error.message);
    res.status(500).json({ message: "Server Error " });
  }
};
export const getCurrentUser = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.log("Error in getCurrentUser Controller", error.message);
    res.status(500).json({ message: "Server Error " });
  }
};


export const getAllInterns = async(req,res) =>{
  try{

    const users = await User.find({role:"User"}).select("-password");
    
    res.json(users)
  }catch(error){
console.log("Error in getAllInterns Controller", error.message);
    res.status(500).json({ message: "Server Error " });
    
  }
}