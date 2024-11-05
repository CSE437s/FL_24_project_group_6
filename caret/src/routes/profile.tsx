import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Storage } from "@plasmohq/storage";

export const Profile = ({ user, setIsLoggedIn}) => {
  const navigate = useNavigate();
  const storage = new Storage({
    copiedKeyList: ["shield-modulation"],
  });
  const colors = ["#C8DB2A", "#FF7BAD", "6FE4CC", "#185D79", "#EF4686"]; //assign user color from here and put in circle
  let strValue: string = user as string;
  const letter = strValue.charAt(0);//first letter

  const followers = 0;// get followers and this number would change, const for now

  const handleHomeClick = () => {
    navigate("/home");
  };

  const handleLogout = async () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    await storage.set("access_token", "");
    navigate("/");
  };

  return (
    <div className=" w-full flex flex-col justify-center p-5">
      <div className="w-full flex items-start m-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF7BAD]"> 
    <p className="text-xl">{letter}</p>
  </div>
  <div className = "flex flex-col ml-2">
  <p className="text-2xl font-bold">{user}</p>
  <p className = "text-sm  text-gray-400">{followers} followers</p>
  </div>
  </div>
      <button
        onClick={handleLogout}
        className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};