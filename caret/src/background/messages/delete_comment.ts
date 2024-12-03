import type { PlasmoMessaging } from "@plasmohq/messaging"
import { delete_comment } from "~api"
 

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    console.log(req)
    const { comment_id } = req.body;
    try{
        let response = await delete_comment(comment_id); 
        console.log(response)
        res.send({ 
            message: "comment_deleted", 
            comments: response.data });
    }
    catch (error) {
        console.error("Error in background script:", error);
        res.send({ error: error.message || "An unknown error occurred" });
    }

}

export default handler