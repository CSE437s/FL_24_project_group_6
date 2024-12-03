import { delete_comment } from "~api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Follower = ({username, index}) => {
    const navigate = useNavigate();
    const handleNavigate = () => {
      // Passing props through state to the target route
      navigate('/other_profile', {
        state: { "user": username }
      });
    };
    const colors = ["#c8db2a", "#FF7BAD", "6FE4CC", "#185D79", "#EF4686"]; //assign user color from here and put in circle
      let strValue: string = username as string;
      const letter = strValue.charAt(0);//first letter
      const color = colors[username.length % colors.length] 
      return(
        <div key={index} className="p-4 bg-slate-100 mt-2 rounded-lg drop-shadow flex row items-center hover:cursor-pointer hover:bg-slate-200" onClick={() => handleNavigate()}>
            <div className="flex h-8 w-8 items-center justify-center rounded-full mr-8" style={{ backgroundColor: color }}> 
                <p className="text-l">{letter}</p>
            </div>
            <div className = "flex">
                <p className="text-xl text-emerald-600">
                    @{username}
                </p>
            </div>

        </div>
    
        );
    
};