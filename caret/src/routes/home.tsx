import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { get_following_comments } from "src/api";
import { Comment} from "~components/Comment";


export const Home = ({ user }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch comments when the component mounts
  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await get_following_comments();
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
    <div className=" h-[450px] flex flex-col justify-center">
      {/* Comments Section */}
      <div className="flex flex-col container px-6 pb-4 ">
        {comments.length > 0 ? (
          <div className="mt-2">
            {comments.map((comment, index) => (
              <Comment isUser = {false} index = {index} username = {comment.username} text = {comment.text} url = {comment.url} selectedText = {comment.selected_text} id = {comment.id}/>
            ))}
          </div>
        ) : (
          <p>No comments available.</p>
        )}
      </div>
    </div>
  );
};
