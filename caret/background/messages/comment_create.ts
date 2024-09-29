import type { PlasmoMessaging } from "@plasmohq/messaging"
import { create_comment, get_me } from "~api" 
 
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log(req)
  
  let response = await create_comment(req.body.comment, req.sender.url, req.body.cssSelector, req.body.selectedText, req.body.textOffsetStart, req.body.textOffsetEnd)
  console.log(response)
  res.send({
    message: "received"
  })
}
 
export default handler