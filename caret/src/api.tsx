import axios from "axios";
import { Storage } from "@plasmohq/storage"


const token_url = "http://localhost:8000/token"
const me_url = "http://localhost:8000/users/me"
const followers_url = "http://localhost:8000/users/me/followers"
const create_comment_url = "http://localhost:8000/create_comment"
const get_comments_url = "http://localhost:8000/comments"
const password_reset_request_url = "http://localhost:8000/password_reset_request/"
const reset_password_url = "http://localhost:8000/reset-password/"
const get_my_comments_url = "http://localhost:8000/users/me/comments"
const delete_comments_url = "http://localhost:8000/delete_comment"
const edit_comments_url = "http://localhost:8000/edit_comments"
const follow_user_by_username = "http://localhost:8000/users/me/follow_by_username"
const get_following_comments_url = "http://localhost:8000/users/me/following/comments"
const create_reply_url = "http://localhost:8000/replies/";
const get_replies_url = (comment_id) => `http://localhost:8000/comments/${comment_id}/replies`;


export function fetch_token(username: string, password: string) {
    return axios.post(token_url, {
        username: username,
        password: password
    }, {headers: {'content-type': 'application/x-www-form-urlencoded'}})
}

export async function get_me() {
    const storage = new Storage({
        copiedKeyList: ["shield-modulation"], 
      })
    const access_token = await storage.get("access_token")
    const config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    return axios.get(me_url, config)
}
export async function get_followers() {
    const storage = new Storage({
        copiedKeyList: ["shield-modulation"], 
      })
    const access_token = await storage.get("access_token")
    const config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    return axios.get(followers_url, config)
}

export async function get_my_comments() {
    const storage = new Storage({
        copiedKeyList: ["shield-modulation"], 
      })
    const access_token = await storage.get("access_token")
    const config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    return axios.get(get_my_comments_url, config)

}
export async function get_following_comments() {
    const storage = new Storage({
        copiedKeyList: ["shield-modulation"], 
      })
    const access_token = await storage.get("access_token")
    const config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    console.log("hello! this")
    return axios.get(get_following_comments_url, config)

}

export async function request_password_reset(email : string) {
    return axios.post(password_reset_request_url, {email: email})
}

export async function reset_password(email : string, new_password : string, token : string, ) {
    const data = {
        email: email,
        token: token,
        new_password: new_password
    }
    return axios.post(reset_password_url, data)
}


export async function create_comment(text : string, url : string, css_selector:string, selectedText : string , textOffsetStart: number, textOffsetEnd: number) {
    const storage = new Storage({
        copiedKeyList: ["shield-modulation"], 
      })
    const access_token = await storage.get("access_token")
    const config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    const data = {
        text: text,
        url: url,
        css_selector: css_selector,
        selected_text: selectedText,
        text_offset_start: textOffsetStart,
        text_offset_end: textOffsetEnd
    }
    return axios.post(create_comment_url, data, config)
}

export async function delete_comment(comment_id: number) {
    const storage = new Storage({
        copiedKeyList: ["shield-modulation"], 
      })
    const access_token = await storage.get("access_token")
    const config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    const url = new URL(delete_comments_url)
    url.searchParams.append("comment_id", comment_id.toString())
    return axios.delete(url.toString(), config)
}

export async function edit_comments(comment_id: number, text: string) {
    const storage = new Storage({
        copiedKeyList: ["shield-modulation"], 
      })
    const access_token = await storage.get("access_token")
    const config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    const edit_url = `${edit_comments_url}/${comment_id}`;
    const data = {
      text
    };
    return axios.put(edit_url.toString(), data, config);
}  


export async function get_url_comments(url : string) {
    return axios.get(get_comments_url, {params: {url : url}})
}

export async function is_user_logged_in() {
    const storage = new Storage({
        copiedKeyList: ["shield-modulation"], 
      })
    const token = await storage.get("access_token"); // Retrieve the access token
    return token
}

export async function follow_by_username(username: string) {
    const storage = new Storage({
        copiedKeyList: ["shield-modulation"], 
      })
    const access_token = await storage.get("access_token")
    const config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    return axios.post(follow_user_by_username + "/" + username, {}, config)
}


export async function get_logged_in_user(){
    const storage = new Storage({
        copiedKeyList: ["shield-modulation"], 
      })
    const access_token = await storage.get("access_token")
    const config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    let response = await axios.get(me_url, config)
    return response.data;

  };

  export async function create_reply(comment_id: number, text: string) {
    const storage = new Storage({
        copiedKeyList: ["shield-modulation"],
    });
    const access_token = await storage.get("access_token");
    const config = {
        headers: { Authorization: `Bearer ${access_token}` },
    };
    const data = {
        text: text,
        comment_id: comment_id,
    };
    return axios.post(create_reply_url, data, config);
}

export async function get_replies(comment_id: number) {
    const storage = new Storage({
        copiedKeyList: ["shield-modulation"],
    });
    const access_token = await storage.get("access_token");
    const config = {
        headers: { Authorization: `Bearer ${access_token}` },
    };
    const url = get_replies_url(comment_id); 
    return axios.get(url, config); 
}

