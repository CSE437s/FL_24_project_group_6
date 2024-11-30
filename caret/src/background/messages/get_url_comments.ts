import type { PlasmoMessaging } from "@plasmohq/messaging"
import { get_url_comments, edit_comment } from "~api"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  try {
    if (req.name === "get_url_comments") {
      const response = await get_url_comments(req.body.url);
      res.send({ message: "display_comments", comments: response.data });
    } else if (req.name === "edit_comment") {
      const { comment_id, text } = req.body;
      const editResponse = await edit_comment(comment_id, text);
      res.send({ message: "comment_edited", comment: editResponse.data });
    } else {
      res.send({ error: "Unknown message name" });
    }
  } catch (error) {
    console.error("Error in background script:", error);
    res.send({ error: error.message || "An unknown error occurred" });
  }
};

export default handler;
