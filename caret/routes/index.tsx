import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetch_token, get_me } from "~api"
import { Storage } from "@plasmohq/storage"
import { Login } from "./login";
import { Home } from "./home";
import { Profile } from "./profile";
import { Signup } from "./signup";
import { useNavigate } from "react-router-dom";
import {
	Box,
	Button,
	createTheme,
	ThemeProvider,
	Typography,
} from "@material-ui/core";

const theme = createTheme({
		typography: {
				fontFamily: "Helvetica Neue",
		},
		palette: {
				primary: {
						main: '#6A8532',
				},
				secondary: {
						main: '#F98128',
				},
		},
});

export const Routing = () => {
    const [username, setUsername] = useState("")
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const storage = new Storage({
        copiedKeyList: ["shield-modulation"], 
      })
      const token = await storage.get("access_token"); // Retrieve the access token

      if (token) {
        // If token exists, user is logged in
        setIsLoggedIn(true);

        // fetch user_details
        try {
          const userDetails = await get_me(); // Assuming this returns user data
          setUsername(userDetails.data.username); // Set username from fetched data
          navigate("/home")
          
        }
        catch {
          setIsLoggedIn(false);
        }
       
      } else {
        // No token found, user is not logged in
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus(); // Invoke the function to check login status
  }, []); // Adding storage as a dependency (optional)

  


 
  // Handle the logout action
  const handleLogout = async () => {
    const storage = new Storage({
      copiedKeyList: ["shield-modulation"], 
    })
    await storage.set("access_token", "");
    setUsername("");
    setIsLoggedIn(false);
  }
		return (
				<ThemeProvider theme={theme}>
						<Routes>
								<Route path="/home" element={<Home user={username} />} />
								<Route path="/" element={<Login setUser={setUsername} setIsLoggedIn={setIsLoggedIn}/>} />
								<Route path="/profile" element={<Profile user={username} />} />
								<Route path="/Signup" element={<Signup />} />
						</Routes>
				</ThemeProvider>
		);
};
