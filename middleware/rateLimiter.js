import rateLimit from "express-rate-limit";

// Email rate limiter - 5 requests per 60 seconds per IP
const emailLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    message: "Too many OTP requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: false,
});

// OTP verification rate limiter - 10 attempts per 60 seconds per IP
const otpVerificationLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    message: "Too many verification attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: false,
});

export { emailLimiter, otpVerificationLimiter };
