import express from "express";

import { protectRoute } from "../middleware/auth.middleware.js";

import {
  acceptFriendRequest,
  getFriendRequests,
  getMyFriends,
  getOutgoingFriendReqs,
  getRecommendedUsers,
  sendFriendRequest,
} from "../controllers/user.controller.js";

const router = express.Router();

// apply auth middleware to all routes
router.use(protectRoute);

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);

// get friend requests for the current user for notification route
// we show friend requests in the notification page and also show accepted friend requests
router.get("/friend-requests", getFriendRequests);

// get outgoing friend request meand which we already sent..
// help to highlight or disable the send friend request button
router.get("/outgoing-friend-requests", getOutgoingFriendReqs);

export default router;
