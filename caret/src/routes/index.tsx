import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetch_token, get_me } from "src/api";
import { Storage } from "@plasmohq/storage";
import { Login } from "./login";
import { Home } from "./home";
import { Profile } from "./profile";
import { Signup } from "./signup";
import { EmailPasswordReset } from "./password_reset_email";
import { ResetPassword } from "./password_reset_new_password";
import { useNavigate } from "react-router-dom";

export const Routing = () => {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkInitialState = async () => {
      const storage = new Storage({
        copiedKeyList: ["shield-modulation"],
      });
      const awaiting_reset = await storage.get("awaiting_reset");
      if (awaiting_reset) {
        navigate("/reset_password");
      } else {
        const token = await storage.get("access_token"); // Retrieve the access token

        if (token) {
          // If token exists, user is logged in
          setIsLoggedIn(true);

          // fetch user_details
          try {
            const userDetails = await get_me(); // Assuming this returns user data
            setUsername(userDetails.data.username); // Set username from fetched data
            navigate("/home");
          } catch {
            setIsLoggedIn(false);
          }
        } else {
          // No token found, user is not logged in
          setIsLoggedIn(false);
        }
      }
    };

    checkInitialState(); // Invoke the function to check login status
  }, []); // Adding storage as a dependency (optional)

  // Handle the logout action
  const handleLogout = async () => {
    const storage = new Storage({
      copiedKeyList: ["shield-modulation"],
    });
    await storage.set("access_token", "");
    setUsername("");
    setIsLoggedIn(false);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto">
      <Routes>
        <Route path="/home" element={<Home user={username} />} />
        <Route path="/" element={<Login setUser={setUsername} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/profile" element={<Profile user={username} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/request_email_reset" element={<EmailPasswordReset />} />
        <Route path="/reset_password" element={<ResetPassword />} />
      </Routes>
    </div>
  );
};
