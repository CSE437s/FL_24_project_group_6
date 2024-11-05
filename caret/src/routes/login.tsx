import React, { useState } from "react";
import { Storage } from "@plasmohq/storage";
import { fetch_token } from "src/api";
import { useNavigate } from "react-router-dom";
import logo from "data-base64:~assets/icon.png";

export const Login = ({ setUser, setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState(""); 
  const [passwordError, setPasswordError] = useState(""); 
  const [loginError, setLoginError] = useState(""); 
  const navigate = useNavigate();
  const storage = new Storage({
    copiedKeyList: ["shield-modulation"],
  });

  const handleLogin = async () => {
    setUsernameError(""); 
    setPasswordError("");
    setLoginError("");

    let valid = true;
    if (!username) {
      setUsernameError("Username is required.");
      valid = false;
    }
    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    }
    if (!valid){
      return;
    }

    try {
      let response = await fetch_token(username, password);
      let token = response.data["access_token"];
      await storage.set("access_token", token);
      await storage.set("username", username);
      console.log("stored");
      setUser(username);
      setIsLoggedIn(true);
      navigate("/home");
    } catch (error){
      if(error.response){
        if(error.response.data.detail){
          if (error.response.data.detail) {
            setLoginError(error.response.data.detail);
          }
        } else{
          setLoginError("Login error: " + error.status);
        }
      }
      console.log("log in error");
    }
  };


  const handleSignUpClick = () => {
    navigate("/signup");
  };

  const handleForgotClick = () => {
    navigate("/request_email_reset");
  };
  
  return (
    <div className="flex min-h-full flex-col justify-center px-4">
  <img className = "mx-auto object-contain size-16" src={logo} alt = "logo"></img>
    <h2 className="mt-4 text-center text-xl font-bold text-customGreenDark">Sign in to Your Account</h2>
      <form className="space-y-4 mt-4">
      <div className="mt-2">
        <input
          type="text"
          id="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className=" h-full w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-customOrangeLight text-sm py-3"
        />
        </div>
        {usernameError && <p className="text-red-500">{usernameError}</p>}

        <div className="flex-col items-center justify-between">
          <div className = "mt-2">
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-full block w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-customOrangeLight text-sm py-3"
        />
        </div>
        {[passwordError] && <p className="text-red-500">{passwordError}</p>}

        <div className = "flex justify-end">
        <button onClick={handleForgotClick} className=" text-gray-400 hover:underline text-xs space-y-2">
          Forgot Password?
        </button>
        </div>
        </div>
        <button
          type="button"
          onClick={handleLogin}
          className="w-full bg-customOrangeDark text-white text-sm py-2 rounded-md hover:bg-customOrangeLight"
        >
          Login
        </button>
        {loginError && <p className="text-red-500">{loginError}</p>}
      </form>
      <div className="text-center mt-4 space-y-2">
      <p className="mt-10 text-center text-xs text-gray-400"> Don't have an account? 
        <button onClick={handleSignUpClick} className=" text-customGreenLight font-semibold hover:underline ml-1">
          Sign Up
        </button>
        </p>
      </div>
    </div>
  );
};
