import React from "react";
import axios from "axios";
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {Button, TextField, Box, Typography, Link} from "@material-ui/core";

export const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate();

  const handleLogin = async() => {
    if (username && password) {
      const formData = new FormData()
      formData.append('username', username)
      formData.append('password', password)
      await axios
      .post("http://localhost:8000/token", formData)
      .then(function (response) {
        console.log(response.data.token, "response.data.token")
        if (response.data.token) {
          localStorage.setItem('token', response.data.token)
          navigate("/profile");
        }
      })
      .catch(function (error) {
        console.log(error, "error");
      });
    } else {
      alert("Please ensure all fields are filled out")
    }
  }
  const handleSignUpClick = () => {
    navigate("/signup");
};
  return (
  <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
    <form id = "loginForm">
    <Typography component = "h1"> Welcome to Caret!
      </Typography>
      <Typography component = "h2"> Comments for the Internet!
      </Typography>
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
