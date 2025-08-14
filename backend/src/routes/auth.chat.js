import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getStreamToken } from "../controllers/chat.controller.js";

const router = express.Router();

// route to get the Stream token to connect to the chat service
router.get("/token", protectRoute, getStreamToken);

export default router;
