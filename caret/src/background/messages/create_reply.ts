import type { PlasmoMessaging } from "@plasmohq/messaging"
import { create_reply } from "~api"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log("req");
  console.log(req);
  console.log(res);

  await create_reply(req.body.commentId, req.body.text);
  console.log("response");
  console.log("after");
  console.log("sending message");

  chrome.tabs.sendMessage(req.sender.tab.id, {
    action: "refresh_replies",
    commentId: req.body.commentId,
  });

  res.send({ message: "received" });
};

export default handler;
