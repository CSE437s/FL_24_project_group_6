import { useState } from "react" 
import React from "react";
import { Button, Box } from "@material-ui/core";
import { ToggleButton } from "@material-ui/lab";
import { useNavigate } from "react-router-dom";
import { Storage } from "@plasmohq/storage"

export const Profile = ({user}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const navigate = useNavigate();
    const storage = new Storage({
        copiedKeyList: ["shield-modulation"], 
      })
    
    const handleHomeClick = () => {
        navigate("/home");
    };
    const handleLogout = async() => {
        localStorage.removeItem("token")
        await storage.set("access_token", "")
        navigate("/");
    };
    return (
        <Box sx={{flexDirection: "column", justifyContent: "center", minWidth: 320, height: 500, padding: 20}}>
                <h1> {user} Profile</h1>
                <Button variant="contained" color="primary" onClick={handleHomeClick}>
                    Home
                </Button>
            <Button
            variant = "contained"
            onClick={handleLogout} >
            Logout
          </Button>
        </Box>
    )
}
