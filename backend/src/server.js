import express from "express";
import "dotenv/config"; // This imports environment variables from .env file
/* 
const dotenv = require("dotenv");
dotenv.config();
OR
import "dotenv/config"; // this is a shorthand for the above two lines
*/

import authRoutes from "./routes/auth.route.js"; // Importing the auth routes
import userRoutes from "./routes/user.route.js"; // Importing the user routes
import chatRoutes from "./routes/auth.chat.js"; // Importing the chat routes

import { connectDB } from "./db/lib.js"; // Importing the connectDB function to connect to MongoDB
import cookieParser from "cookie-parser"; // // Importing cookie-parser to parse cookies in the request headers

const app = express(); // Create an Express application
const PORT = process.env.PORT || 5002; // Default to 5002 if PORT is not set in .env

app.use(express.json()); // for parsing req.body data as JSON
app.use(cookieParser()); // for parsing cookies in the request headers

// not best practice - optimize these code
/*
app.get("/api/auth/signup", (req, res) => {
  res.send("Signup");
});
app.get("/api/auth/login", (req, res) => {
  res.send("Login");
});
app.get("/api/auth/logout", (req, res) => {
  res.send("Logout");
});
*/

// optimizing routes for handling authentication-related requests
app.use("/api/auth", authRoutes);
// optimizing routes for handling user-related requests
app.use("/api/users", userRoutes);
// optimizing routes for handling chat-related requests
// This route will handle the chat service token generation
app.use("/api/chat", chatRoutes);

app.listen(PORT, () => {
  console.log(`server listening on port no: ${PORT}`);
  connectDB(); // Call the connectDB function to establish a connection to MongoDB with our app
});
