import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { request_password_reset } from "src/api";
import { Storage } from "@plasmohq/storage";
import logo from "data-base64:~assets/icon.png";

export const EmailPasswordReset = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    try {
      const result = await request_password_reset(email);
      console.log("Password reset email sent");
      navigate("/reset_password");
      const storage = new Storage({
        copiedKeyList: ["shield-modulation"],
      });
      await storage.set("awaiting_reset", true);
    } catch (error) {
      console.error("Error sending password reset email:", error);
    }
  };

  const handleBack = () => {
    navigate("/"); // Navigate to login page
  };

  const handleSignUpClick = () => {
    navigate("/signup"); // Navigate to signup page
  };

  return (
    <div className=" h-[450px] flex flex-col justify-between p-2">
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
    <h2 className="mt-5 mb-5 text-center text-xl font-bold text-customGreenDark">Reset Your Pasword</h2>
      </div>

      <form className="flex flex-col space-y-4 mt-10 mb-10">
        <input
          type="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-full w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-customOrangeLight text-sm py-3"
        />

        <button
          type="button"
          onClick={handleResetPassword}
          className="w-full bg-customOrangeDark text-white text-sm py-2 rounded-md hover:bg-customOrangeLight"
        >
          Send Reset Email
        </button>
      </form>

      <div className="text-center space-y-2">
      <p className="mt-10 text-center text-xs text-gray-400"> Don't have an account? 
        <button onClick={handleSignUpClick} className=" text-customGreenLight font-semibold hover:underline ml-1">
          Sign Up
        </button>
        </p>
      </div>
    </div>
  );
};
