import type { PlasmoMessaging } from "@plasmohq/messaging";
import { get_replies } from "~api";

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log("req");
  console.log(req);
  console.log(res);

  const replies = await get_replies(req.body.comment_id);
  console.log("response");
  console.log(replies);

  res.send({ message: "received", replies });
};

export default handler;
