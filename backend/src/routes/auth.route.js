import express from "express";

import {
  signup,
  login,
  logout,
  onboard,
} from "../controllers/auth.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

/*
// This route is for onboarding a user, which might include setting up their profile or updating their information.
// protectRoute is a middleware that ensures the user is authenticated before accessing this route.
*/
router.post("/onboarding", protectRoute, onboard);

// check user is login or not
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
