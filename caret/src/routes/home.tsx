import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { get_my_comments } from "src/api";
import ProfileNav from "../components/profileNav";

export const Home = ({ user }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch comments when the component mounts
  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await get_my_comments();
        setComments(response.data);
      } catch (err) {
        // setError("Failed to fetch comments.");
      } finally {
        setLoading(false);
      }
    }
    fetchComments();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="flex flex-col justify-center h-[500px] p-5">
      <ProfileNav/>
      {/* Welcome Title */}
      <div className="flex justify-start mb-4">
        <h1 className="text-xl">Welcome, {user}!</h1>
      </div>

      {/* Comments Section */}
      <div className="flex flex-col">
        <h3 className="text-xl mb-2">Recent Comments:</h3>

        {comments.length > 0 ? (
          <div className="mt-2">
            {comments.map((comment, index) => (
              <div
                key={index}
                className="p-4 bg-green-100 mt-2 rounded-lg"
              >
                <p className="font-medium">
                  {comment.username}: {comment.text}
                </p>
                <p className="text-gray-500">
                  <a target="_blank" rel="noopener noreferrer" href={comment.url}>{comment.url}</a>
                </p>
                <p>
                  Selected Text: {comment.selected_text}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No comments available.</p>
        )}

        <button
          onClick={() => navigate("/profile")}
          className="bg-customOrangeDark text-white rounded-md py-2 mt-5 w-full"
        >
          Go to Profile
        </button>
      </div>
    </div>
  );
};
