import type { PlasmoMessaging } from "@plasmohq/messaging"
import { create_comment, get_me } from "~api" 
 
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log("req")
  console.log(req)
  console.log(res)
  
  await create_comment(req.body.comment, req.sender.url, req.body.cssSelector, req.body.selectedText, req.body.textOffsetStart, req.body.textOffsetEnd)
  console.log("response")
  console.log("adter")
  console.log("sending message")
  chrome.tabs.sendMessage(req.sender.tab.id, {
    action: "refresh_comments"
  })
  res.send(
    {message: "received"}
  )
  
}
 
export default handler