import { Route, Routes } from "react-router-dom"
import {useState} from "react"
import {Login} from "./login"
import {Home} from "./home"
import {Profile} from "./profile"
import {Signup} from "./signup"
import {
  Box,
  Button,
  createTheme,
  ThemeProvider,
  Typography,
} from "@material-ui/core";
export const Routing = () => {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  return(
    <Routes>
      <Route path="/home" element={<Home user= {user} />} />
      <Route path="/" element={<Login setToken = {setToken} setUser = {setUser}/>} />
      <Route path="/profile" element={<Profile user = {user}/>} />
      <Route path="/Signup" element={<Signup />} />
    </Routes>
  )
}