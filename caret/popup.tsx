import { useState } from "react"

function IndexPopup() {
  const [data, setData] = useState("")

  return (
    <div
      style={{
        padding: 40,
        width: 340
      }}>

      <h1 style={{textAlign: "center"}}>Welcome to Caret</h1>
      <h3 style={{textAlign: "center"}}>Comments for the Internet</h3>

      <input 
        type="text" 
        placeholder="Username" 
        style={{
          width: "93%",
          padding: 10,
          marginTop: 20
        }}
      />

      <input 
        type="password" 
        placeholder="Password" 
        style={{
          width: "93%",
          padding: 10,
          marginTop: 20
        }}
      />

      <button
        style={{
          width: "100%",
          padding: 10,
          marginTop: 20,
          backgroundColor: "green",
          color: "white",
          // add a shadow effect to the button
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          // make the button look clickable
          cursor: "pointer"
        }}
      >
        Login 

      </button>
        
    </div>

  )
}

export default IndexPopup
