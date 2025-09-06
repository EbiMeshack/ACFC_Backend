import express from "express";
import { mongoConnection } from "./config/db.js";
import dotenv from "dotenv";
import { router as userRouter } from "./routes/user.js";
import { router as lyricRouter } from "./routes/lyric.js";
import { router as authRouter } from "./routes/auth.js";
dotenv.config();
const app = express();
app.use(express.json());

mongoConnection();

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "this is the backend server." });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/lyrics", lyricRouter);
app.use("/api/v1/auth", authRouter);

app.listen(5000, () => {
  console.log(`http://localhost:5000`);
});
