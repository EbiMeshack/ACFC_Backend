import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import "dotenv/config";
import { generateTempOTP, verifyTempOTP } from "../services/otpService.js";
import { sendOTP } from "../services/emailService.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userResponse = await User.findOne({ email: email });
    if (!userResponse) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const matchPassword = await bcrypt.compare(password, userResponse.password);
    if (!matchPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const OTP = await generateTempOTP(userResponse);

    if (userResponse.email) {
      await sendOTP(userResponse.email, OTP);
      return res.status(200).json({
        success: true,
        message: "OTP sent successfully.",
        userID: userResponse._id,
        requiresOTP: true,
      });
    }
  } catch (e) {
    console.log("Error logging in User:", e);
    return res
      .status(500)
      .json({ sucess: false, message: "Internal server error" });
  }
};

export const verify_otp = async (req, res) => {
  try {
    const { userID, OTP } = req.body;
    const userResponse = await User.findById(userID);
    if (!userResponse) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    const isValid = await verifyTempOTP(userResponse, OTP);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Error in verifying OTP, check again in a while.",
      });
    }
    const token = jwt.sign(
      { userID: userResponse._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    const userData = {
      id: userResponse._id,
      email: userResponse.email,
      phone: userResponse.phone,
      role: userResponse.role,
      branch: userResponse.branch,
      subBranch: userResponse.subBranch,
    };
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (e) {
    console.error("Error in verify_otp:", e);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again.",
    });
  }
};

export const signup = async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(409)
        .json({ sucess: false, message: "email already exists." });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const userData = {
      name,
      email,
      phone,
      password: hashPassword,
    };
    const newUser = new User(userData);
    const savedUser = await newUser.save();

    const userResponse = {
      id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      phone: savedUser.phone,
    };

    res.status(201).json({
      success: true,
      message: "user created successfully.",
      user: userResponse,
    });
  } catch (e) {
    console.log("Error Creating User:", e);
    return res
      .status(500)
      .json({ sucess: false, message: "Internal server error" });
  }
};
