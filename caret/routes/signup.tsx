import React from "react";
import axios from "axios";
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {Button, TextField, Box, Typography} from "@material-ui/core";

  export const Signup = () => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleSignup = async () => {
      if (email && username && password) {
        const formData = new FormData()
        formData.append("email", email)
        formData.append('username', username)
        formData.append('password', password)
        await axios
        .post("http://localhost:8000/users/", formData)
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
    return (
    <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
      <form id = "signinForm">
      <Typography component = "h1"> Create Your Caret Account!
        </Typography>
        <TextField
          id ="email"
          label="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          variant = "outlined"
        />
  <TextField
          id = "username"
          label="Username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
          variant = "outlined"
        />
  
        <TextField
          id ="password"
          label="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          variant = "outlined"
        />
                 
        <Button
          onClick={handleSignup}
          variant = "contained"
        >
          Login
        </Button>
        </form>
      </Box>
    )
  }
  

  