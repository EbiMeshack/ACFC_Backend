import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    isOnline: {
      type: Boolean,
      default: false,
    },
    resetToken: String,
    resetTokenExpiry: Date,
    tempOTP: {
      code: String,
      expiresAt: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
// module.exports = User;
