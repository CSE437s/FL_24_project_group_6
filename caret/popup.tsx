import { useState } from "react"
import { fetch_token, get_me } from "~api"
import { Storage } from "@plasmohq/storage"
import { MemoryRouter } from "react-router-dom"
import { Routing } from "~routes"

function IndexPopup() {
  const [username, setUsername] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  //access plasmo persistent storage
  const storage = new Storage({
    copiedKeyList: ["shield-modulation"], 
  })

    // Handle the login action
  const handleLogin = async (username: string, password: string) => {
    try {
      let response = await fetch_token(username, password)
      let token = response.data["access_token"]
      console.log(token)
      await storage.set("access_token", token)
      console.log("stored")
    } catch {
      console.log("log in error")
    }

    setUsername(username)
  }

  // Handle the logout action
  const handleLogout = async () => {
    await storage.set("access_token", "")
    setUsername("")
  }


  return (
     <MemoryRouter>
      <Routing />
    </MemoryRouter>
  )
}

export default IndexPopup
