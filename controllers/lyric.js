import { Lyric } from "../models/Lyric.js";

export async function getLyrics(req, res) {
  try {
    const { letter, limit = 10, page = 1 } = req.query;
    let query = {};

    if (letter) {
      const trimmedLetter = letter.trim().toUpperCase();

      if (trimmedLetter.length !== 1 || !/[A-Z]/.test(trimmedLetter)) {
        return res.status(400).json({
          success: false,
          error: "Letter must be a single alphabetic character (A-Z)",
        });
      }

      query.title = { $regex: `^${trimmedLetter}`, $options: "i" };
    }
    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);

    if (limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        error: "Limit must be between 1 and 100",
      });
    }

    if (pageNum < 1) {
      return res.status(400).json({
        success: false,
        error: "Page must be a positive number",
      });
    }

    const skip = (pageNum - 1) * limitNum;

    const response = await Lyric.find(query)
      .limit(limitNum)
      .skip(skip)
      .sort({ title: 1 });
    res.status(200).json({
      success: true,
      count: response.length,
      page: page,
      limit: limit,
      data: response,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
}

export async function createLyric(req, res) {
  try {
    const { letter, title, tamil_lyrics, english_lyrics, createdBy } = req.body;
    if (!letter || letter.length !== 1 || letter !== letter.toUpperCase()) {
      return res.status(400).json({
        success: false,
        message: "Letter must be a single uppercase alphabet character.",
      });
    }
    if (title) {
      const existingTitle = await Lyric.findOne({ title: title });
      if (existingTitle) {
        return res.status(400).json({
          success: false,
          message: "Title already exists, please give a new one.",
        });
      }
    }
    if (
      (tamil_lyrics && !Array.isArray(tamil_lyrics)) ||
      (english_lyrics && !Array.isArray(english_lyrics))
    ) {
      return res.status(400).json({
        success: false,
        message: "Lyric should be provided in an Array format.",
      });
    }
    const lyricData = {
      letter,
      title,
      tamil_lyrics,
      english_lyrics,
      createdBy,
    };

    const lyric = new Lyric(lyricData);
    const savedLyric = await lyric.save();
    return res.status(201).json({
      success: true,
      message: "Created successfully.",
      created: savedLyric,
    });
  } catch (e) {
    console.log("Error in Lyric:", e);

    return res.status(500).json({
      success: false,
      error: e,
    });
  }
}
