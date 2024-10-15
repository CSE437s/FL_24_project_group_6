import { Navigate, useNavigate } from "react-router-dom"
import { useState, useEffect} from "react"
import {Box, Typography, Button, FormControl} from "@material-ui/core"
import { get_my_comments } from "~api";

export const Home = ({ user }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch comments when the component mounts
  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await get_my_comments()
        setComments(response.data);
      } catch (err) {
        setError("Failed to fetch comments.");
      } finally {
        setLoading(false);
      }
    }
    fetchComments();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box
      sx={{
        flexDirection: "column",
        justifyContent: "center",
        minWidth: 320,
        height: 500,
        padding: 20,
      }}
    >
      {/* Welcome Title */}
      <Box sx={{ display: "flex", justifyContent: "left" }}>
        <Typography component="h1">Welcome, {user}!</Typography>
      </Box>
      {/* Comments Section */}
      <FormControl variant="standard" fullWidth>
        <Typography component="h3" variant="h5" margin="normal">
          Recent Comments:
        </Typography>
      
      {comments.length > 0 ? (
        <Box sx={{ marginTop: 2 }}>
          {comments.map((comment, index) => (
            <Box
              key={index}
              sx={{
                padding: 2,
                backgroundColor: "lightgreen",
                marginTop: 2,
                borderRadius: 4,
              }}
            >
              <Typography variant="body1">
                {comment.username}: {comment.text}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <a target="_blank" href={comment.url}>{comment.url}</a>
              </Typography>
              <Typography variant="body2">
                Selected Text: {comment.selected_text}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography>No comments available.</Typography>
      )}

      <Button
        onClick={() => navigate("/profile")}
        variant="contained"
        color="primary"
        sx={{ width: "100%", marginTop: 3 }}
      >
        Go to Profile
      </Button>
      </FormControl>
    </Box>
  );
};