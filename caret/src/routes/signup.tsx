import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Storage } from "@plasmohq/storage";

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
    <div className="flex flex-col justify-between h-[400px] p-2">
      <div className="flex justify-start">
        <button
          className="text-customOrangeLight hover:underline"
          aria-label="Back"
          onClick={handleBack}
        >
          ← Back
        </button>
      </div>

      <form className="flex flex-col space-y-4">
        <h1 className=" text-xl text-customGreenDark font-bold mb-4">Create Your Caret Account!</h1>

        <input
          type="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-customOrangeDark"
        />

        <input
          type="text"
          id="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-customOrangeDark"
        />

        <input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-customOrangeDark"
        />

        <button
          type="button"
          onClick={handleSignup}
          className="w-full bg-customOrangeDark text-white py-2 px-4 rounded-md hover:bg-customOrangeDark"
        >
          Sign Up
        </button>
      </form>

      <button
        className="mt-4 text-customGreenLight hover:underline"
        onClick={handleBack}
      >
        Back to login
      </button>
    </div>
  );
};