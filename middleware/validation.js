// middlewares/validation.js
import { body, validationResult } from "express-validator";

// Validation rules for login
export const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .notEmpty()
    .withMessage("Email is required"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .notEmpty()
    .withMessage("Password is required"),
];

export const otpValidation = [
  body("OTP").notEmpty().withMessage("OTP is required"),
  body("userID").isEmpty().withMessage("User ID is required."),
];

// Validation rules for signup
export const signupValidation = [
  body("name")
    .isLength({ min: 2, max: 20 })
    .withMessage("Name must be at least 2 characters")
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .notEmpty()
    .withMessage("Email is required"),

  body("phone")
    .isMobilePhone()
    .withMessage("Please provide a valid phone number")
    .notEmpty()
    .withMessage("Phone number is required"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .notEmpty()
    .withMessage("Password is required"),
];

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  next(); // Continue to the next middleware/controller
};
