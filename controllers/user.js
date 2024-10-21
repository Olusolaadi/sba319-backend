import User from "../models/User.js";
import { getError } from "../utils/errors.js";
import jwt from "jsonwebtoken";

export const getUser = async (req, res) => {
  const { name, username, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user)
    return getError(res, "Email already exists");

  if (!username || !email || !password)
    return res
      .status(400)
      .json({ success: false, error: "All fields are required" });

  if (!name)
   return res.status(400).json({
  success: false, error: "Name is required"});

  if (!username)
    return res.status(400).json({
      success: false,
      error: "Username is required"
    });

  if (password.length < 6)
    return res.status(400).json({
      success: false,
      error: "Password must be at least 6 characters",
    });

  if (!email.includes("@"))
    return res.status(400).json({ success: false, error: "Invalid email" });

  const newUser = new User({ name, username, email, password, });
  await newUser.save();
  res.send(newUser);
};


export const login = async (req, res) => {
  const { email, password } = req.body;
  const userLogin = email.trim() || password.trim();
  if (!userLogin)
    return getError(res, "email or password is required");
  
const user = await User.findOne({ email });
  if (!user) return getError(res, "User not found");

  const isMatch = await user.comparePassword(password)
  if (!isMatch) return getError(res, "email or password does not match.")

   const token =  jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "3d"}, (e, token) => {
      if (e) throw e;
      res.json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
        },
      });
    });

  }