import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export async function getRecommendedUsers(req, res) {
  try {
    /*
        // we able to get currentUserId form req.user because we have applied protectRoute middleware
        // in there which we set user data into req.user in auth.middleware.js
        // and we can access it here
        */
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);
    // -> we can also use this to get the current user data
    // const currentUser = req.user; // using req.user directly as it contains the user data

    // Find users who are not the current user and not friends of the current user
    const recommendedUsers = await User.find({
      // Exclude the current user - $ne: not equal
      // Exclude friends who are already friends or in friend list - $nin: not in
      _id: { $ne: currentUserId, $nin: currentUser.friends },
      isOnboarded: true, // Only include users who are onboarded means who have completed their profile learningLanguage as well as nativeLanguage
    });

    res.status(200).json(recommendedUsers); // Send the recommended users as a response
  } catch (error) {
    console.log("Error in getRecommendedUsers controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user._id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic learningLanguage nativeLanguage"
      );

    // console.log(user);
    // console.log(user.friends);

    res.status(200).json(user.friends); // Send the friends list as a response
  } catch (error) {
    console.log("Error in getMyFriends controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user._id;
    const { id: recipientId } = req.params;

    // prevent sending request to yourself
    if (myId === recipientId) {
      return res
        .status(400)
        .json({ message: "you can'nt send friend request to yourself" });
    }

    // check if the recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // check if the users is already a friend
    if (recipient.friends.includes(myId)) {
      return res
        .status(400)
        .json({ message: "you are already friends with this user" });
    }

    // check if the friend request already exists or request is already sent
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Friend request already exists between you and this user",
      });
    }

    //              [now finally create a new friend request]
    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(201).json(friendRequest);
  } catch (error) {
    console.log("Error in sendFriendRequest controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;

    // console.log(req.params);
    // console.log(typeof requestId);
    // console.log(await FriendRequest.find());

    // check if the friend request exists
    const friendRequest = await FriendRequest.findById(requestId);


    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found"});
    }

    // check if the current user is the recipient
    if (friendRequest.recipient.toString() !== req.user._id) {
      return res.status(403).json({
        message: "You are not authorized to accept this friend request",
      });
    }

    friendRequest.status = "accepted";
    await friendRequest.save(); // Save the updated friend request to the db

    //          [Add the users to each other's friends list]
    /*
    // $addToSet: adds the value to the array only if it doesn't already exist
    // This prevents duplicates in the friends list
    */

    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient }, // Add recipient to sender's friends list
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender }, // Add sender to recipient's friends list
    });

    res.status(200).json({ message: "Friend request accepted successfully" });
  } catch (error) {
    console.log("Error in acceptFriendRequest controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/*
// This function retrieves all incoming and accepted friend requests for the current user
// Incoming requests are those sent to the current user, and accepted requests are those accepted by the current user
*/
export async function getFriendRequests(req, res) {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending", // Only get pending requests
    }).populate(
      "sender",
      "fullName profilePic learningLanguage nativeLanguage"
    );

    const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted", // Only get accepted requests
    }).populate("recipient", "fullName profilePic");

    res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (error) {
    console.log("Error in getFriendRequests controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// This function retrieves all outgoing friend requests sent by the current user
export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate(
      "recipient",
      "fullName profilePic learningLanguage nativeLanguage"
    );

    res.status(200).json(outgoingReqs);
  } catch (error) {
    console.log("Error in getOutgoingFriendReqs controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
