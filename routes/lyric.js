import { Router } from "express";
import { createLyric, getLyrics } from "../controllers/lyric.js";

export const router = Router();

router.get("/", getLyrics);
router.post("/", createLyric);
