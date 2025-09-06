import speakeasy from "speakeasy";
import User from "../models/User.js";
import bcrypt from "bcrypt";

// Add a Map to track OTP generation attempts
const otpGenerationTracker = new Map();

// Generate a temporary OTP for login
const generateTempOTP = async (user) => {
  const userId = user._id.toString();
  const now = Date.now();

  // Check if user has recent OTP generation
  const lastGeneration = otpGenerationTracker.get(userId);
  if (lastGeneration && now - lastGeneration < 60000) {
    // 1 minute cooldown
    throw new Error("Please wait 1 minute before requesting another OTP");
  }

  const otp = speakeasy.totp({
    secret: speakeasy.generateSecret().base32,
    digits: 6,
    step: 300, // 5 minutes
  });

  // Hash the OTP with bcrypt before saving
  const saltRounds = 10;
  const hashedOTP = await bcrypt.hash(otp, saltRounds);

  // Save the hashed OTP to the user
  user.tempOTP = {
    code: hashedOTP,
    expiresAt: new Date(now + 5 * 60 * 1000), // 5 minutes from now
  };
  await user.save();

  // Update the generation tracker
  otpGenerationTracker.set(userId, now);

  // Clean up old entries every hour
  setTimeout(() => otpGenerationTracker.delete(userId), 3600000);

  return otp;
};

// Verify temporary OTP
const verifyTempOTP = async (user, otp) => {
  if (!user.tempOTP || !user.tempOTP.code || !user.tempOTP.expiresAt) {
    return false;
  }

  // Check if OTP has expired
  if (new Date() > user.tempOTP.expiresAt) {
    // Clear expired OTP
    user.tempOTP = undefined;
    await user.save();
    return false;
  }

  // Verify OTP using bcrypt compare
  const isValid = await bcrypt.compare(otp, user.tempOTP.code);

  if (isValid) {
    // Clear used OTP
    user.tempOTP = undefined;
    await user.save();
  }

  return isValid;
};

export { generateTempOTP, verifyTempOTP };
