import { Router } from "express";
import { getUsers } from "../controllers/user.js";
import auth from "../middleware/auth.js";
import { standardLimiter } from "../middleware/rateLimiter.js";

export const router = Router();

router.get("/", auth, standardLimiter, getUsers);
