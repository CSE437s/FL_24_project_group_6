import type { PlasmoMessaging } from "@plasmohq/messaging"
import { get_url_comments } from "~api"
 
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log(req)
  let response = await get_url_comments(req.body.url)
  console.log(response)
  res.send({
    message: "display_comments",
    comments: response.data 
  })
}
 
export default handler