import { Router } from "express";
import { createLyric, getLyrics } from "../controllers/lyric.js";
import auth from "../middleware/auth.js";
import { standardLimiter } from "../middleware/rateLimiter.js";

export const router = Router();

router.get("/", auth, standardLimiter, getLyrics);
router.post("/", auth, standardLimiter, createLyric);
