import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Storage } from "@plasmohq/storage";

export const Profile = ({ user }: { user: string }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const storage = new Storage({
    copiedKeyList: ["shield-modulation"],
  });

  const handleHomeClick = () => {
    navigate("/home");
  };

  const handleLogout = async () => {
    localStorage.removeItem("token");
    await storage.set("access_token", "");
    navigate("/");
  };

  return (
    <div className="flex flex-col justify-center p-5">
      <h1 className="text-2xl font-semibold mb-6">{user} Profile</h1>

      <button
        onClick={handleHomeClick}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mb-4"
      >
        Home
      </button>

      <button
        onClick={handleLogout}
        className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};