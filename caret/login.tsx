import { useState } from "react"

interface LoginProps {
  onLogin: (username: string, password: string) => void
}

const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    if (username && password) {
      onLogin(username, password) // Call parent function to handle login
    } else {
      alert("Please ensure all fields are filled out")
    }
  }

  return (
    <div style={{ padding: 40, width: 340 }}>
      <h1 style={{ textAlign: "center" }}>Welcome to Caret</h1>
      <h3 style={{ textAlign: "center" }}>Comments for the Internet</h3>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{
          width: "93%",
          padding: 10,
          marginTop: 20,
        }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "93%",
          padding: 10,
          marginTop: 20,
        }}
      />

      <button
        onClick={handleLogin}
        style={{
          width: "100%",
          padding: 10,
          marginTop: 20,
          backgroundColor: "green",
          color: "white",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          cursor: "pointer",
        }}
      >
        Login
      </button>
    </div>
  )
}

export default Login
