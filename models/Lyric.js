import mongoose from "mongoose";

const lyricSchema = new mongoose.Schema(
  {
    letter: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      index: true,
    },
    tamil_lyrics: [
      {
        type: String,
        required: true,
      },
    ],
    english_lyrics: [
      {
        type: String,
        required: true,
      },
    ],
    url: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Compound index for better search performance
lyricSchema.index(
  {
    title: "text",
    tamil_lyrics: "text",
    english_lyrics: "text",
  },
  {
    weights: {
      title: 10,
      tamil_lyrics: 5,
      english_lyrics: 5,
    },
  }
);

const Lyric = mongoose.model("tamil_christian_songs", lyricSchema);

export { lyricSchema, Lyric };
