import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Storage } from "@plasmohq/storage";
import logo from "data-base64:~assets/icon.png";

export const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const navigate = useNavigate();
  const storage = new Storage({
    copiedKeyList: ["shield-modulation"],
  });

  const handleBack = () => {
    navigate("/");
  };

  const validEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const complexPassword = (password) => {
    // 6 characters long, contain an uppercase letter, a lowercase letter, and a number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+={}\[\]:;"'<>?,.\/\\\-]{6,}$/;
    return passwordRegex.test(password);
  };



  const handleSignup = async () => {
    setEmailError("");
    setUsernameError("");
    setPasswordError("");
    setGeneralError(""); 
    let valid = true; 

    if (!email){
      setEmailError("Email is required.");
      valid = false;
    }
    if (!validEmail(email)){
      setEmailError("Please enter a valid email address.");
      valid = false;
    }
    if (!username) {
      setUsernameError("Username is required.");
      valid = false;
    }
    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    }
    if (!complexPassword(password)) {
      setPasswordError("Password must be at least 6 characters long and include uppercase, lowercase, and a number.");
      valid = false;
    }
    if (!valid){
      return;
    }

    const data = {username, email, password}; 
    console.log(data); 

    try {
      const response = await axios.post("http://localhost:8000/users/", data);
      console.log("Response from server:", response);
      storage.set("access_token", response.data.token);
      navigate("/");
    } catch (error) {
      if (error.response) {
        if (error.response.data.detail) {
          if (error.response.data.detail.includes("Username")) {
            setUsernameError("Username is already taken.");
          }
          else if (error.response.data.detail.includes("Email")) {
            setEmailError("Email is already registered.");
          } else{
          setGeneralError(error.response.data.detail);
          }
        } else{
          setGeneralError("An unexpected error occurred: code " + error.response.status + ". Please try again.");
        }
      } else {
        setGeneralError("An unexpected error occurred. Please try again.");
      }
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
        {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}


        <input
          type="text"
          id="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="h-full w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-customOrangeLight text-sm py-3"
        />
        {usernameError && <p className="text-red-500">{usernameError}</p>}

        <input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="h-full w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-customOrangeLight text-sm py-3"
        />
        {passwordError && <p className="text-red-500">{passwordError}</p>}

        <button
          type="button"
          onClick={handleSignup}
          className="w-full bg-customOrangeDark text-white text-sm py-2 rounded-md hover:bg-customOrangeLight"
        >
          Sign Up
        </button>
        {generalError && <p className="text-red-500">{generalError}</p>} 
      </form>
    </div>
  );
};