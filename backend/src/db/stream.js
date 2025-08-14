import { StreamChat } from "stream-chat";
import "dotenv/config"; // Load environment variables from .env file

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error(
    "STREAM_API_KEY and STREAM_API_SECRET must be set in the environment variables."
  );
}

// with this we can now able to communicate with Stream Application
const streamClient = StreamChat.getInstance(apiKey, apiSecret);

// Function to create a user in Stream
export const upsertStreamUser = async (userData) => {
  try {
    // upsertUser will create a new user if it doesn't exist or update the existing user
    await streamClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.error(" Error upserting Stream user:", error);
  }
};

// TODO: CREATE THE USER IN STREAM AS WELL - done
// generate stream token for the user to connect to the chat service
export const generateStreamToken = (userId) => {
  try {
    // ensure userId is string
    const userIdStr = userId.toString();
    return streamClient.createToken(userIdStr);
  } catch (error) {
    console.log("Error generating Stream token:", error);
  }
};
