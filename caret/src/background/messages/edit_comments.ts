import type { PlasmoMessaging } from "@plasmohq/messaging"
import { edit_comments } from "~api"
 

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    console.log(req)
    const { comment_id, text } = req.body;
    try{
        let response = await edit_comments(comment_id, text); 
        console.log(response)
        res.send({ 
            message: "comment_edited", 
            comments: response.data });
    }
    catch (error) {
        console.error("Error in background script:", error);
        res.send({ error: error.message || "An unknown error occurred" });
    }

}

export default handler