import type { PlasmoMessaging } from "@plasmohq/messaging"
import { create_reply } from "~api"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log("req");
  console.log(req);
  console.log(res);

  await create_reply(req.body.comment_id, req.body.text);
  console.log("response");
  console.log("after");
  console.log("sending message");

  chrome.tabs.sendMessage(req.sender.tab.id, {
    action: "refresh_replies",
    comment_id: req.body.comment_id,
  });

  res.send({ message: "received" });
};

export default handler;
