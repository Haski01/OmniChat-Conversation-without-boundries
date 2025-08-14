import { generateStreamToken } from "../db/stream.js";

export async function getStreamToken(req, res) {
  try {
    // calling getStreamToken from stream.js file in db folder
    // getStreamToken function generate a token for the user to connect to the chat service
    const token = generateStreamToken(req.user.id);

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error in getStreamToken controller", error.message);
    res.status(500).json({ message: "Internerl server error" });
  }
}
