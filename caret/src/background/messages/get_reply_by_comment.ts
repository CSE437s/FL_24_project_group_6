import type { PlasmoMessaging } from "@plasmohq/messaging";
import { get_replies } from "~api";

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log("req");
  console.log(req);
  console.log(res);

  try{
    const replies = await get_replies(req.body.comment_id);
    console.log("response");
    console.log(replies);
  
    chrome.tabs.sendMessage(req.sender.tab.id, {
      action: "refresh_replies",
      comment_id: req.body.comment_id,
    });
  
    res.send({ message: "success", replies });
  } catch(error){
    res.send({ message: "error", error: error.message });
  }
  
};

export default handler;

