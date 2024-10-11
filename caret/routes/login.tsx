import React from "react";
import { useState } from "react"
import { Storage } from "@plasmohq/storage"
import { fetch_token, get_me } from "~api"
import { useNavigate } from "react-router-dom"
import {Button, TextField, Box, Typography, Link} from "@material-ui/core"

export const Login = ({setToken, setUser}) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate();
  const storage = new Storage({
    copiedKeyList: ["shield-modulation"], 
  })
      const handleLogin = async () => {
        try {
          let response = await fetch_token(username, password)
          let token = response.data["access_token"]
          await storage.set("access_token", token)
          setToken(response.data.token)
          console.log("stored")
          setUser(username)
          navigate("/profile");
        } catch {
          console.log("log in error")
        }
    }
  const handleSignUpClick = () => {
    navigate("/signup");
};
  return (
  <Box sx={{flexDirection: "column", justifyContent: "center", minWidth: 320, height: 500, padding: 20}}>
    <form id = "loginForm">
      <div id = "header-text">
    <Typography component = "h1"> Welcome to Caret!
      </Typography>
      <Typography component = "h2"> Comments for the Internet!
      </Typography>
      </div>
      <Box sx = {{margin:2, flexDirection:"row"}}>
<TextField
        id = "username"
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        variant = "outlined"
      />

      <TextField
        id ="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        variant = "outlined"
      />
       
      <Button
        onClick={handleLogin}
        variant = "contained"
      >
        Login
      </Button>
      </Box>
      </form>
      <Link
      component="button"
      variant="body2"
      onClick={handleSignUpClick}
>
  
 Don't have an account? Sign Up
</Link>
    </Box>
  )
}
