import React, { useState } from "react";
import { Storage } from "@plasmohq/storage";
import { fetch_token } from "src/api";
import { useNavigate } from "react-router-dom";

export const Login = ({ setUser, setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const storage = new Storage({
    copiedKeyList: ["shield-modulation"],
  });

  const handleLogin = async () => {
    try {
      let response = await fetch_token(username, password);
      let token = response.data["access_token"];
      await storage.set("access_token", token);
      await storage.set("username", username);
      console.log("stored");
      setUser(username);
      setIsLoggedIn(true);
      navigate("/profile");
    } catch {
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
    <div className="flex flex-col justify-between  h-[400px] p-5">
      <div>
        <h1 className="text-2xl font-bold text-customGreenDark mb-2">Welcome to Caret</h1>
        <h2 className="text-lg mb-4">Comments for the Internet!</h2>
      </div>

      <form className="space-y-4">
        <input
          type="text"
          id="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-customOrangeLight"
        />
        
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-customOrangeLight"
        />
        
        <button
          type="button"
          onClick={handleLogin}
          className="w-full bg-customOrangeDark text-white py-2 rounded-md hover:bg-customOrangeLight"
        >
          Login
        </button>
      </form>

      <div className="mt-4 space-y-2">
        <button onClick={handleForgotClick} className="text-customGreenLight hover:underline">
          Forgot Password?
        </button>
        <button onClick={handleSignUpClick} className="text-customGreenLight hover:underline">
          Don't have an account? Sign Up
        </button>
      </div>
    </div>
  );
};
