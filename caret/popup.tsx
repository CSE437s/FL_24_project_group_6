import { useState } from "react"
import Login from "./login"
import Home from "./home"
import Profile from "./profile"
import { fetch_token, get_me } from "~api"
import { Storage } from "@plasmohq/storage"

function IndexPopup() {
  const [view, setView] = useState("login")
  const [username, setUsername] = useState("")

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
    setView("home")
  }

  // Handle the logout action
  const handleLogout = async () => {
    console.log(await get_me())
    setUsername("")
    setView("login")
  }

  const handleProfileView = (username: string) => {
    setUsername(username)
    setView("profile")
  }

  return (
    <>
      {view === "login" && <Login onLogin={handleLogin} />}
      {view === "home" && <Home username={username} onLogout={handleLogout} onProfile={handleProfileView}/>}
      {view === "profile" && <Profile userName={username} />}
    </>
  )
}

export default IndexPopup
