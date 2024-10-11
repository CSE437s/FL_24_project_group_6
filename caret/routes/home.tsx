import { Navigate, useNavigate } from "react-router-dom"
import { useState } from "react"

  export const Home = () => {
    const [username, setUsername] = useState("")
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const navigate = useNavigate()

    return (
        <div
          style={{
            padding: 40,
            width: 340,
          }}>
          <h1>Welcome! {username} </h1>
          <h3>Recent Comments: </h3>
  
          <div style={{ padding: 10, backgroundColor: "lightgreen", marginTop: 20 }}>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
            
        <button
            onClick={() => navigate("/profile")} // Button to go to profile page
            style={{
                width: "100%",
                padding: 10,
                marginTop: 20,
                backgroundColor: "green",
                color: "white",
                cursor: "pointer",
            }}>
            Go to Profile
        </button>
        </div>
      )
}


  