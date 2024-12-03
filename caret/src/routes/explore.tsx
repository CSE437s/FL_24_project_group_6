import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Storage } from "@plasmohq/storage";
import { follow_by_username, get_followers, search_users } from "~api";

export const Explore = ({ current_user }) => {
  const navigate = useNavigate();
  const storage = new Storage({
    copiedKeyList: ["shield-modulation"],
  });
  const colors = ["#C8DB2A", "#FF7BAD", "6FE4CC", "#185D79", "#EF4686"]; // Assign user color from here and put in circle
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [notification, setNotification] = useState(""); // Notification message state


  const handleUsernameChange = async (e) => {
    const userInput = e.target.value;
    setUsername(userInput);

    if (userInput) {
      try {
        const response = await search_users(userInput);
        console.log(response);
        setSuggestedUsers(response.data.map((obj) => obj.username));
      } catch (err) {
        console.error("Failed to fetch suggested users.", err);
      }
    } else {
      setSuggestedUsers([]);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  const handleFollowUser = async (usernameToFollow) => {
    try {
      await follow_by_username(usernameToFollow);
      console.log(`Following user: ${usernameToFollow}`);
      setNotification(`You have successfully followed ${usernameToFollow}.`);
      setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds
      setUsername("")
    } catch (err) {
      console.error("Failed to follow user.", err);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center p-5">
      {notification && (
        <div
          className="bg-green-100 text-green-700 p-2 rounded-md text-center shadow-md fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-3/4"
          style={{ maxWidth: "500px" }}
        >
          {notification}
        </div>
      )}

      <div>
        <h2 className="mt-4 text-center text-xl font-bold text-customGreenDark">
          Follow a Careter
        </h2>
      </div>

      <form className="flex flex-col space-y-4 mt-5">
        <div>
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            autoComplete="off"
            required
            className="h-10 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-customOrangeLight text-sm py-3"
          />
          {usernameError && (
            <p className="text-red-500 text-sm mt-1">{usernameError}</p>
          )}

          {current_user && suggestedUsers.length > 0 && (
            <ul className="border p-2 border-gray-300 max-h-30 overflow-y-scroll">
              {suggestedUsers.map((suggestedUser, index) => (
                <li
                  key={index}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    setUsername(suggestedUser);
                    setSuggestedUsers([]);
                  }}
                >
                  {suggestedUser}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="button"
          onClick={() => handleFollowUser(username)}
          className="w-full bg-green-500 text-white text-sm py-2 rounded-md hover:bg-green-600"
        >
          Follow!
        </button>
      </form>
    </div>
  );
};
