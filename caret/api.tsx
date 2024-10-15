import axios from "axios";
import { Storage } from "@plasmohq/storage"


const token_url = "http://localhost:8000/token"
const me_url = "http://localhost:8000/users/me"
const create_comment_url = "http://localhost:8000/create_comment"
const get_coments_url = "http://localhost:8000/comments"


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

export async function get_url_comments(url : string) {
    return axios.get(get_coments_url, {params: {url : url}})
}