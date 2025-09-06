import User from "../models/User.js";

export async function getUsers(req, res) {
  try {
    const response = await User.find();
    res
      .status(200)
      .json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
}
