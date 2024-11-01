import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { reset_password } from "src/api";
import { Storage } from "@plasmohq/storage";

export const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    try {
      // API call to reset password
      const response = await reset_password(email, newPassword, token);
      const storage = new Storage({
        copiedKeyList: ["shield-modulation"],
      });
      await storage.set("awaiting_reset", false);
      navigate("/"); // Navigate to login on success
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  const handleLoginClick = async () => {
    const storage = new Storage({
      copiedKeyList: ["shield-modulation"],
    });
    await storage.set("awaiting_reset", false);
    navigate("/"); // Navigate to login page
  };

  return (
    <div className="flex flex-col justify-between min-w-[320px] h-[400px] p-5">
      <div>
        <h1 className="text-2xl font-bold text-purple-500 mb-2">
          Reset Your Password
        </h1>
        <h2 className="text-lg mb-4">
          Enter your email, new password, and the token received.
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

        <input
          type="password"
          id="new-password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          id="token"
          placeholder="Reset Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="button"
          onClick={handleResetPassword}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Reset Password
        </button>
      </form>

      <button
        onClick={handleLoginClick}
        className="mt-4 text-blue-500 hover:underline"
      >
        Back to login
      </button>
    </div>
  );
};
