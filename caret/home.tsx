interface HomeProps {
    username: string
    onLogout: () => void
    onProfile: (username: string) => void
  }
  
  const Home = ({ username, onLogout, onProfile }: HomeProps) => {
    return (
        <div
          style={{
            padding: 40,
            width: 340,
          }}>
          <h1>Welcome, {username}!</h1>
          <h3>Recent Comments: </h3>
  
          <div style={{ padding: 10, backgroundColor: "lightgreen", marginTop: 20 }}>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
  
          <div style={{ padding: 10, backgroundColor: "lightgreen", marginTop: 20 }}>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
  
          <div style={{ padding: 10, backgroundColor: "lightgreen", marginTop: 20 }}>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
  
          </div>
  
          <div style={{ padding: 10, backgroundColor: "lightgreen", marginTop: 20 }}>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
  
          </div>
          
        <button
            onClick={() => onProfile(username)} // Button to go to profile page
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

          <button
            onClick={onLogout} // Button to go back to login page
            style={{
              width: "100%",
              padding: 10,
              marginTop: 20,
              backgroundColor: "blue",
              color: "white",
              cursor: "pointer",
            }}>
  
            Logout
  
          </button>
        </div>
      )
}

  
  export default Home
  