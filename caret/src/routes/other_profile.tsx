import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Storage } from "@plasmohq/storage";
import { follow_by_username, get_comments_by_username, get_followers_by_username, unfollow_user_by_username } from "~api";
import { get_followers } from "~api";
import { Comment } from "~components/Comment";
import { useLocation } from 'react-router-dom';
import { Follower } from "~components/Follower";

export const OtherProfile = (props) => {
  const location = useLocation();
  console.log("loc")
  console.log(location)
  const user = location.state.user || {}; // Extract the props from location.state
  const navigate = useNavigate();
  const storage = new Storage({
    copiedKeyList: ["shield-modulation"],
  });
  const colors = ["#c8db2a", "#FF7BAD", "6FE4CC", "#185D79", "#EF4686"]; //assign user color from here and put in circle
  let strValue: string = user as string;
  const letter = strValue.charAt(0);//first letter
  const color = colors[user.length % colors.length] 
  const [followers, setFollowers] = useState([]);
  const [comments, setComments] = useState([])
  const [showFollowers, setShowFollowers] = useState(false)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const handleLogout = async () => {
    localStorage.removeItem("token");
    props.setIsLoggedIn(false);
    await storage.set("access_token", "");
    navigate("/");
  };
  async function fetchFollowers() {
    try {
        console.log(user)
      const response = await get_followers_by_username(user);
      setFollowers(response.data);

    } catch (err) {
      // setError("Failed to fetch comments.");
    }
  }
  async function fetchComments() {
    try {
      const response = await get_comments_by_username(user);
      setComments(response.data);
      console.log(response.data)
    } catch (err) {
      setError("Failed to fetch comments.");
    } finally {
      setLoading(false);
    }
  }
    // Fetch comments when the component mounts
    useEffect(() => {
      
      fetchFollowers();
      fetchComments();
    }, [user]);
    const handleFollow = async () => {
        try {
            console.log(user)
            await follow_by_username(user)
            await fetchFollowers()
        }
        catch {
            setError(true)
        }
    }
    const handleUnfollow = async () => {
        try {
            await unfollow_user_by_username(user)
            await fetchFollowers()
        }
        catch {
            setError(true)
        }
    }
    if (loading) {
      return <div></div>;
    }
  
    if (error) {
      return <div className="text-red-500 text-center">{error}</div>;
    }
    console.log("current:")
    console.log(props.current_user)
    console.log(user)
    console.log(user == props.current_user)
    console.log("follower")
    console.log(followers)
  if (!showFollowers) {
    return (
        <div className=" w-full flex flex-col justify-center p-5">
        <div className="mb-2 border-b-2 border-gray-300">
        <div className="w-full flex items-start m-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: color }}> 
                <p className="text-xl">{letter}</p>
            </div>
    <div className="flex flex-row align-bottom">
        <div className = "flex flex-col ml-2 mr-14 ">
            <p className="text-2xl font-bold">{user}</p>
            <p className = "text-sm  text-gray-400 hover:text-gray-900 hover:cursor-pointer" onClick={() => setShowFollowers(true)}>{followers.length} followers</p>
        </div>
        {(props.current_user != user ? ((followers.find((follower) => {
            console.log(follower.username)
            console.log(props.current_user)
            console.log(follower.username == props.current_user)
            return follower.username == props.current_user}) == undefined) ? <button onClick={() => handleFollow()} className="w-16 h-8 bg-green-500 text-white rounded-md mt-4 hover:bg-green-600">Follow</button> : <button onClick={() => handleUnfollow()} className="w-16 h-8 border-red-500 border-2 text-red-500 rounded-md mt-4 hover:bg-red-500 hover:text-white">Unfollow</button>) : <button onClick={() => handleLogout()} className="w-16 h-8 border-red-500 border-2 text-red-500 rounded-md mt-4 hover:bg-red-500 hover:text-white">Log Out</button>)}

        
    </div>
    </div>
    </div>
        

    <div className="flex flex-col justify-center">
            {/* Comments Section */}
            <div className="flex flex-col container px-6 pb-4">  
            {comments.length > 0 ? (
                <div className="mt-2">
                {comments.map((comment, index) => (
                    <Comment isUser = {props.current_user == user} index = {index} username = {comment.username} text = {comment.text} url = {comment.url} selectedText = {comment.selected_text} id = {comment.id} refreshComments={() => fetchComments()}/>
                ))}
                </div>
            ) : (
                <p>No comments available.</p>
            )}
            </div>
        </div>
        </div>
    );
    }
    else {
        return (
            <div className=" w-full flex flex-col justify-center p-5">
            <div className="mb-2 border-b-2 border-gray-300">
            <div className="w-full flex items-start m-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: color }}> 
            <p className="text-xl">{letter}</p>
        </div>
        <div className = "flex flex-col ml-2 ">
        <p className="text-2xl font-bold">{user}</p>
        <p className = "text-sm  text-gray-400 hover:text-gray-900 hover:cursor-pointer" onClick={() => setShowFollowers(false)}>{comments.length} comments</p>
        </div>
        </div>
        </div>
            
    
        <div className="flex flex-col justify-center">
                {/* followers Section */}
                <div className="flex flex-col container px-6 pb-4">  
                {followers.length > 0 ? (
                    <div className="mt-2" onClick={() => setShowFollowers(false)}>
                    {followers.map((follower, index) => (
                        <Follower index={index} username={follower.username} />
                    ))}
                    </div>
                ) : (
                    <p>No followers.</p>
                )}
                </div>
            </div>
            </div>
        );
    }
};