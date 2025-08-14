import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/*
// Define the User schema
// This schema defines the structure of the User document in MongoDB

// timestamp is automatically added to the schema
// timestamps: true -> will add createdAt and updatedAt fields
*/
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    bio: {
      type: String,
      default: "",
    },
    profePiilc: {
      type: String,
      default: "",
    },
    nativeLanguage: {
      type: String,
      default: "",
    },
    learningLanguage: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

/*
// This middleware can be used to hash the password before saving the user
// You can use bcrypt or any other hashing library here

// Example: this.password = await bcrypt.hash(this.password, 10);
*/
userSchema.pre("save", async function (next) {
  // Check if the password is modified or new
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/*
// this function helps us to login user
// this function is used to match the entered password with the hashed password in the database
// It returns true if the passwords match, otherwise false
*/
userSchema.methods.matchPassword = async function (enterdPassword) {
  const isPasswordCorrect = await bcrypt.compare(enterdPassword, this.password);
  return isPasswordCorrect;
};

/*
// creating model from the schema
// The model is used to interact with the MongoDB collection
*/
const User = mongoose.model("User", userSchema);

export default User;
