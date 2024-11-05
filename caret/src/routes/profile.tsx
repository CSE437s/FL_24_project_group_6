import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Storage } from "@plasmohq/storage";
import { follow_by_username } from "~api";
import { get_followers } from "~api";

export const Profile = ({ user, setIsLoggedIn}) => {
  const navigate = useNavigate();
  const storage = new Storage({
    copiedKeyList: ["shield-modulation"],
  });
  const colors = ["#C8DB2A", "#FF7BAD", "6FE4CC", "#185D79", "#EF4686"]; //assign user color from here and put in circle
  let strValue: string = user as string;
  const letter = strValue.charAt(0);//first letter
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [followingNotif, setfollowingNotif] = useState(""); 
  const [outputError, setOutputError] = useState(""); 
  const [followers, setFollowers] = useState([0]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Fetch comments when the component mounts
    useEffect(() => {
      async function fetchFollowers() {
        try {
          const response = await get_followers();
          console.log("tyring!");
          setFollowers(response.data);
        } catch (err) {
          // setError("Failed to fetch comments.");
        } finally {
          setLoading(false);
        }
      }
      fetchFollowers();
    }, []);
  
    if (loading) {
      return <div className="text-center">Loading...</div>;
    }
  
    if (error) {
      return <div className="text-red-500 text-center">{error}</div>;
    }

  const handleHomeClick = () => {
    navigate("/home");
  };

  const handleLogout = async () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    await storage.set("access_token", "");
    navigate("/");
  };
  const handleFollowUser = async () => {
    console.log("hi!")

    if (!username || username == ''){
      setUsernameError("Please enter a username.")
      return;
    }
    setUsernameError("")
    try{ 
      await follow_by_username(username)
      setfollowingNotif("Successfully followed " + username)
      setUsername("")
    }
    catch(error){
      if(error.response){
        if(error.response.data.detail){
          setOutputError(error.response.data.detail);
        }
      } else{
        setOutputError("Failed to follow " + username + " with error " + error.status + ". Try again")
      }
    }

  }

  return (
    <div className=" w-full flex flex-col justify-center p-5">
      <div className="mb-2 border-b-2 border-gray-300">
      <div className="w-full flex items-start m-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF7BAD]"> 
    <p className="text-xl">{letter}</p>
  </div>
  <div className = "flex flex-col ml-2 ">
  <p className="text-2xl font-bold">{user}</p>
  <p className = "text-sm  text-gray-400">{followers.length} followers</p>
  </div>
  </div>
    </div>
      {followingNotif && (
      <div className="relative bg-blue-100 text-blue-500 p-2 rounded-md shadow-md">
        <p>{followingNotif}</p>
        <button 
          className="absolute top-1 right-1 text-blue-700 font-bold"
          onClick={() => (setfollowingNotif(""))} // Dismisses by setting `followingNotif` to empty string
        >
          X
        </button>
      </div>
      )}
      {outputError && (
      <div className="relative bg-red-100 text-red-500 p-2 rounded-md shadow-md">
        <p>{outputError}</p>
        <button 
          className="absolute top-1 right-1 text-red-700 font-bold"
          onClick={() => (setOutputError(""))} // Dismisses by setting `outputError` to empty string 
        >
          X
        </button>
      </div>
      )}
    <div>
      <h2 className="mt-4 text-center text-xl font-bold text-customGreenDark">Follow a Careter</h2>
      </div>

      <form className="flex flex-col space-y-4 mt-5">

        <input
          type="username"
          id="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="h-full w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-customOrangeLight text-sm py-3"
        />
        {usernameError && <p className="text-red-500 text-sm mt-1">{usernameError}</p>}

        <button
          type="button"
          onClick={() => handleFollowUser()}
          className="w-full bg-green-500 text-white text-sm py-2 rounded-md hover:bg-green-600"
        >
          Follow!
        </button>
      </form>
      <button
        onClick={handleLogout}
        className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 mt-4"
      >
        Logout
      </button>
    </div>
  );
};