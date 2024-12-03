import axios from "axios";
import { Storage } from "@plasmohq/storage"


const token_url = "http://34.72.50.33/token"
const me_url = "http://34.72.50.33/users/me"
const followers_url = "http://34.72.50.33/users/me/followers"
const create_comment_url = "http://34.72.50.33/create_comment"
const get_comments_url = "http://34.72.50.33/comments"
const password_reset_request_url = "http://34.72.50.33/password_reset_request/"
const reset_password_url = "http://34.72.50.33/reset-password/"
const get_my_comments_url = "http://34.72.50.33/users/me/comments"
const delete_comments_url = "http://34.72.50.33/delete_comment"
const edit_comments_url = "http://34.72.50.33/edit_comments"
const follow_user_by_username = "http://34.72.50.33/users/me/follow_by_username"
const get_following_comments_url = "http://34.72.50.33/users/me/following/comments"
const search_users_url = "http://34.72.50.33/search_users"


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
export async function get_comments_by_username(username: string) {
    const user_id = await get_user_id_from_username(username)
    return get_comments_by_user_id(user_id)
}
export async function get_followers_by_username(username: string) {
    const user_id = await get_user_id_from_username(username)
    return get_followers_by_user_id(user_id)
}
export async function get_followers_by_user_id(user_id: string) {
    const url = `http://34.72.50.33/users/${user_id}/followers`
    return axios.get(url)
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
export async function get_comments_by_user_id(user_id: string) {
    const url = "http://34.72.50.33/users/" + user_id + "/comments"
    return axios.get(url)
}
export async function get_username_from_user_id(user_id) {
    const url = `http://34.72.50.33/users/${user_id}/username`
        const response = await axios.get(url);
        return response.data; // This will be the username
}
export async function get_user_id_from_username(username) {
    const url = `http://34.72.50.33/users/${username}/id`
        const response = await axios.get(url);
        return response.data; // This will be the user_id
}

export async function unfollow_user_by_username(username) {
    const storage = new Storage({
        copiedKeyList: ["shield-modulation"], 
      })
    const access_token = await storage.get("access_token")
    const config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    const user_id = await get_user_id_from_username(username)
    const url = `http://34.72.50.33/users/me/unfollow/${user_id}`
    return axios.delete(url, config)
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
  



export async function search_users(username: string) {
    return axios.get(search_users_url, {params: {query : username}})
}