import { useState } from "react"
import Login from "./login"
import Home from "./home"
import Profile from "./profile"

function IndexPopup() {
  const [view, setView] = useState("login")
  const [username, setUsername] = useState("")

  // Handle the login action
  const handleLogin = (user: string) => {
    setUsername(user)
    setView("home")
  }

  // Handle the logout action
  const handleLogout = () => {
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
