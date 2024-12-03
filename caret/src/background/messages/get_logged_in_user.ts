import type { PlasmoMessaging } from "@plasmohq/messaging";
import { get_logged_in_user } from "~api";

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  try {
    const user = await get_logged_in_user(); // Fetch the full user object
    console.log("User fetched:", user);

    // Respond with only the username
    res.send({ username: user.username });
  } catch (error) {
    console.error("Error in background script:", error);
    res.send({
      error: error.message || "An unknown error occurred",
    });
  }
};

export default handler;