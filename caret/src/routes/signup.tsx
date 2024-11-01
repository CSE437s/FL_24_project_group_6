import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Storage } from "@plasmohq/storage";
import logo from "data-base64:~assets/icon.png";

export const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const storage = new Storage({
    copiedKeyList: ["shield-modulation"],
  });

  const handleBack = () => {
    navigate("/");
  };

  const handleSignup = async () => {
    if (email && username && password) {
      const data = { username, email, password };
      console.log(data);

      try {
        const response = await axios.post("http://localhost:8000/users/", data);
        console.log(response.data.token, "response.data.token");
        storage.set("access_token", response.data.token);
        console.log("stored");
        navigate("/");
      } catch (error) {
        console.error(error, "error");
      }
    } else {
      alert("Please ensure all fields are filled out");
    }
  };

  return (
    <div className="flex flex-col justify-between p-2">
      <div className="flex justify-start">
        <button
          className="text-customOrangeLight hover:underline"
          aria-label="Back"
          onClick={handleBack}
        >
          ← Back
        </button>
      </div>
      <div>
      <img className = "mx-auto object-contain size-16" src={logo} alt = "logo"></img>
    <h2 className="mt-4 text-center text-xl font-bold text-customGreenDark">Create Your Account</h2>
      </div>

      <form className="flex flex-col space-y-4 mt-5">

        <input
          type="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-full w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-customOrangeLight text-sm py-3"
        />

        <input
          type="text"
          id="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="h-full w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-customOrangeLight text-sm py-3"
        />

        <input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="h-full w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-customOrangeLight text-sm py-3"
        />

        <button
          type="button"
          onClick={handleSignup}
          className="w-full bg-customOrangeDark text-white text-sm py-2 rounded-md hover:bg-customOrangeLight"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};