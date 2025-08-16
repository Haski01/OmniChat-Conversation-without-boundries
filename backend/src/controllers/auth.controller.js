import User from "../models/User.js";
import { upsertStreamUser } from "../db/stream.js";
import jwt from "jsonwebtoken";

// This function handles user signup
export async function signup(req, res) {
  const { fullName, email, password } = req.body;

  // Validate the input data
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already existed please use diffrent one " });
    }

    // Create a new user
    const newUser = await User.create({
      fullName,
      email,
      password,
      profilePic: "",
    });

    // TODO: CREATE THE USER IN STREAM AS WELL - done
    // when we save user to the database, we could also create a user in Stream
    try {
      // call function to created or updated user in Stream
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
      console.log(`Stream user created for ${newUser.fullName}`);
    } catch (error) {
      console.log("Error creating Stream user:", error);
    }

    // create a JWT token
    const token = jwt.sign(
      { userId: newUser._id }, // payload or data
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    // Set the token in HTTP-only cookie
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true, // Prevents XSS atack (prevent JavaScript access to the cookie)
      sameSite: "Strict", // Helps prevent CSRF attacks
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    });

    // Send the response that user is created successfully
    res.status(201).json({
      message: "User created successfully",
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.log("Error in signup controller:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

// This function handles user login
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validate the input data
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the user exists by using email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    // Check if the password is correct
    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Invalid email or password" });

    // create a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    // Set the token in HTTP-only cookie
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true, // Prevents XSS atack (prevent JavaScript access to the cookie)
      sameSite: "Strict", // Helps prevent CSRF attacks
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    });

    // Send the response that user is logged in successfully
    res.status(200).json({
      message: "User logged in successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error in login controller:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

// This function handles user logout
export async function logout(req, res) {
  // Clear the JWT cookie
  res.clearCookie("jwt"),
    res.status(200).json({
      message: "User logged out successfully",
      success: true,
    });
}

//              [This function handles user onboarding]

// It might include setting up their profile or updating their information
export async function onboard(req, res) {
  try {
    const userId = req.user._id;
    const {
      fullName,
      bio,
      nativeLanguage,
      learningLanguage,
      location,
      profilePic,
    } = req.body;

    console.log(req.body.profilePic);

    // Validate the input data
    if (
      !fullName ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      }); // recomment those fields only who are missing, basicaly filter out missing fields
    }

    // Find the user by ID and update their profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        profilePic: profilePic,
        isOnboarded: true,
      },
      { new: true }
    ); // { new: true } returns the updated document

    await updatedUser.save();

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    //        [TODO: UPDATE THE USER IN STREAM AS WELL - done]

    // when we update user in the database, we could also update a user in Stream
    try {
      // we call prevously created function to update user in Stream bcz upsertStreamUser function will create a user if it does not exist or update the user if it already exists
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
      console.log(`Stream user updated for ${updatedUser.fullName}`);
    } catch (StreamError) {
      console.log("Error updating Stream user:", StreamError.message);
      res
        .status(500)
        .json({ message: "error updating stream user during onboarding" });
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.log("Error in onboard controller:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}
