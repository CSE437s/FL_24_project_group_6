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
