import mongoose from "mongoose";

const apiLogSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
    method: {
      type: String,
      required: true,
    },
    url: {
      half: {
        type: String,
        required: true,
      },
      full: {
        type: String,
        required: true,
      },
    },
    token: {
      present: {
        type: Boolean,
        default: false,
      },
      length: {
        type: Number,
        default: 0,
      },
      exp: {
        type: Number,
        default: null,
      },
      lastFour: {
        type: String,
        default: null,
      },
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: "User",
    },
    userAgent: {
      type: String,
      default: null,
    },
    ip: {
      type: String,
      required: true,
    },
    statusCode: {
      type: Number,
      required: true,
      min: 100,
      max: 599,
    },
    responseTime: {
      type: String,
      required: true,
    },
    errorMessage: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "apiLogs",
  }
);

export const ApiLog = mongoose.model("ApiLog", apiLogSchema);
