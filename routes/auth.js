import { Router } from "express";
import { login, signup, verify_otp } from "../controllers/auth.js";
import {
  signupValidation,
  loginValidation,
  handleValidationErrors,
  otpValidation,
} from "../middleware/validation.js";
import {
  emailLimiter,
  otpVerificationLimiter,
} from "../middleware/rateLimiter.js";

export const router = Router();

router.post(
  "/login",
  emailLimiter,
  loginValidation,
  handleValidationErrors,
  login
);
router.post(
  "/verify-otp",
  otpVerificationLimiter,
  otpValidation,
  handleValidationErrors,
  verify_otp
);
router.post("/signup", signupValidation, handleValidationErrors, signup);
