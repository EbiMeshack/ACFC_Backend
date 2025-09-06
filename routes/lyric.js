import { Router } from "express";
import { createLyric, getLyrics } from "../controllers/lyric.js";
import auth from "../middleware/auth.js";

export const router = Router();

router.get("/", auth, getLyrics);
router.post("/", auth, createLyric);
