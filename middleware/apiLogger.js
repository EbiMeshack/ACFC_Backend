import { getID, getIDExp } from "../services/tokenExtractionService.js";
import { ApiLog } from "../models/apiLogs.js";

export const logAPIRequests = (req, res, next) => {
  const startTime = Date.now();

  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

  let responseBody = "";
  const originalSend = res.send;
  const originalJson = res.json;

  const token = req.headers.authorization?.split(" ")[1];
  let userID = null;
  let tokenValidity = null;

  try {
    if (token) {
      userID = getID(token);
      tokenValidity = getIDExp(token);
    }
  } catch (error) {
    console.warn("Invalid token in logging middleware:", error.message);
  }

  res.send = function (body) {
    responseBody = body;
    return originalSend.call(this, body);
  };

  res.json = function (body) {
    responseBody = JSON.stringify(body);
    return originalJson.call(this, body);
  };

  res.on("finish", async () => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: {
        half: req.url,
        full: fullUrl,
      },
      token: {
        present: !!token,
        length: token?.length || 0,
        exp: tokenValidity,
        lastFour: token ? `...${token.slice(-4)}` : null,
      },
      userID: userID,
      userAgent: req.get("User-Agent"),
      ip: req.ip,
      statusCode: res.statusCode,
      responseTime: `${Date.now() - startTime}ms`,
      errorMessage: res.statusCode >= 400 ? responseBody : null,
    };
    const newLog = new ApiLog(logEntry);
    await newLog.save();
  });

  next();
};
