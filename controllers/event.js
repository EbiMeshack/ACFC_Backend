import Event from "../models/Event.js";
import mongoose from "mongoose";

export const getEvents = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    let query = {};

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

    const response = await Event.find(query).limit(limitNum).skip(skip);

    if (!response) {
      return res
        .status(400)
        .json({ success: false, message: "No events Found." });
    }
    res.status(200).json({
      success: true,
      count: response.length,
      page: page,
      limit: limit,
      data: response,
    });
  } catch (e) {
    console.log("Error in Event fetch:", e);
    res.status(500).json({ success: false, error: "Server error." });
  }
};

export const getEventByID = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await Event.findById(id);
    if (!response) {
      return res
        .status(400)
        .json({ success: false, message: `Event not found with id: ${id}` });
    }
    res.status(200).json({
      success: true,
      message: "Successfully fetched Event.",
      data: response,
    });
  } catch (e) {
    console.log("Error in Event fetch", e);
    res.status(500).json({ success: false, error: "Server error." });
  }
};

export const createEvents = async (req, res) => {
  try {
    const { id, name, description, songs, verses, time, date } = req.body;
    const eventData = {
      eventName: name,
      eventDate: date,
      eventTime: time,
      eventDescription: description,
      eventVerses: verses,
      eventSongs: songs,
      createdBy: id, // This should be the user ID who created the event
    };

    const newEvent = new Event(eventData);
    const savedEvent = await newEvent.save();
    res.status(201).json({
      success: true,
      message: "Event created Successfully.",
      created: savedEvent,
    });
  } catch (e) {
    console.log("Error in creating Event:", e);
    res.status(500).json({ success: false, error: "Failed to created Event." });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, songs, verses, time, date } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID format.",
      });
    }

    const updateData = {};
    if (name !== undefined) updateData.eventName = name;
    if (description !== undefined) updateData.eventDescription = description;
    if (songs !== undefined) updateData.eventSongs = songs;
    if (verses !== undefined) updateData.eventVerses = verses;
    if (time !== undefined) updateData.eventTime = time;
    if (date !== undefined) updateData.eventDate = date;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided to update.",
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: `Event not found with id: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Update completed successfully.",
      data: updatedEvent,
    });
  } catch (e) {
    console.log("Error in updating Event:", e);
    res.status(500).json({
      success: false,
      error: "Failed to update Event.",
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(401)
        .json({ success: false, message: "Event id is required." });
    }

    const response = await Event.findByIdAndDelete(id);

    if (!response) {
      return res.status(404).json({
        success: false,
        message: `Event not found with id: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully.",
      data: response,
    });
  } catch (e) {
    console.log("Error in deleting Event:", e);
    res.status(500).json({
      success: false,
      error: "Failed to delete Event.",
    });
  }
};
