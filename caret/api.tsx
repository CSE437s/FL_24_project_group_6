import axios from "axios";
import { Storage } from "@plasmohq/storage"


const token_url = "http://localhost:8000/token"
const me_url = "http://localhost:8000/users/me"


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