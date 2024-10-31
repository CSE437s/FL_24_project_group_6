import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { request_password_reset } from "src/api";
import { Storage } from "@plasmohq/storage";

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

  const handleLoginClick = () => {
    navigate("/"); // Navigate to login page
  };

  const handleSignUpClick = () => {
    navigate("/signup"); // Navigate to signup page
  };

  return (
    <div className="flex flex-col justify-between min-w-[320px] h-[400px] p-5">
      <div>
        <h1 className="text-2xl font-bold text-purple-500 mb-2">
          Reset Your Password
        </h1>
        <h2 className="text-lg mb-4">
          Enter your email address to reset your password.
        </h2>
      </div>

      <form className="space-y-4">
        <input
          type="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="button"
          onClick={handleResetPassword}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Send Reset Email
        </button>
      </form>

      <div className="mt-4">
        <button
          onClick={handleLoginClick}
          className="text-blue-500 hover:underline"
        >
          Back to Login
        </button>
        <br />
        <button
          onClick={handleSignUpClick}
          className="text-blue-500 hover:underline"
        >
          Don't have an account? Sign Up
        </button>
      </div>
    </div>
  );
};
