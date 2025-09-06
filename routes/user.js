import { Router } from "express";
import { getUsers } from "../controllers/user.js";

export const router = Router();

router.get("/", getUsers);
