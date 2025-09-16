import { Router } from "express";
import {
  createEvents,
  deleteEvent,
  getEventByID,
  getEvents,
  updateEvent,
} from "../controllers/event.js";
import auth from "../middleware/auth.js";
import {
  eventValidation,
  handleValidationErrors,
} from "../middleware/validation.js";

export const router = Router();

router.get("/", auth, getEvents);
router.get("/:id", auth, getEventByID);
router.post("/", auth, eventValidation, handleValidationErrors, createEvents);
router.patch("/:id", auth, updateEvent);
router.delete("/:id", auth, deleteEvent);
