import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes
// It checks if the user is authenticated by verifying the JWT token
// If the token is valid, it attaches the user data to the request object

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    // console.log(token);

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - no token provided" });
    }

    //                      #[Verify the token]

    // check is the token is valid or not if token is provided
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - invalid token" });
    }

    // Find the user by userId from the decoded token
    // We use select("-password") to exclude the password field from the user object
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - user not found" });
    }

    // console.log(user);

    // Attach the user to the request object for further use in the route handlers
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectedRoute route middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
