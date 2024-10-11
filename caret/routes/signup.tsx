import React from "react";
import axios from "axios";
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Storage } from "@plasmohq/storage"
import {Button, TextField, Box, Typography} from "@material-ui/core"
  export const Signup = () => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const storage = new Storage({
      copiedKeyList: ["shield-modulation"], 
    })
    const handleSignup = async () => {
      if (email && username && password) {
        const data = {username,email, password}
        console.log(data)
        await axios
        .post("http://localhost:8000/users/", data )
        .then(function (response) {
          console.log(response.data.token, "response.data.token")
            storage.set("access_token", response.data.token)
           console.log("stored")
            navigate("/");
        })
        .catch(function (error) {
          console.log(error, "error");
        });
      } else {
        alert("Please ensure all fields are filled out")
      }
    }
    return (
      <Box sx={{flexDirection: "column", justifyContent: "center", minWidth: 320, height: 500, padding: 20}}>
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
          Sign Up
        </Button>
        </form>
      </Box>
    )
  }
  

  