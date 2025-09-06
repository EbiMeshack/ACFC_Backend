import { Router } from "express";
import { getUsers } from "../controllers/user.js";
import auth from "../middleware/auth.js";

export const router = Router();

router.get("/", auth, getUsers);
