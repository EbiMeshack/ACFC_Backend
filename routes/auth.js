import { Router } from "express";
import { login, signup, verify_otp } from "../controllers/auth.js";
import {
  signupValidation,
  loginValidation,
  handleValidationErrors,
  otpValidation,
} from "../middleware/validation.js";

export const router = Router();

router.post("/login", loginValidation, handleValidationErrors, login);
router.post("/verify-otp", otpValidation, handleValidationErrors, verify_otp);
router.post("/signup", signupValidation, handleValidationErrors, signup);
