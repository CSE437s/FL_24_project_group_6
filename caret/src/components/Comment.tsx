import { delete_comment, edit_comments } from "~api"; // Import required API functions
import { useState } from "react";

export const Comment = ({ isUser, index, username, text, url, selectedText, id }) => {
  const [render, setRender] = useState(true); // Whether to render the comment
  const [isEditing, setIsEditing] = useState(false); // Whether the comment is in edit mode
  const [editableText, setEditableText] = useState(text); // The text currently being edited
  const [originalText, setOriginalText] = useState(text); // The original text

  const handleSaveEdit = async () => {
    try {
      if (!editableText.trim()) {
        console.error("Cannot save empty text");
        return;
      }

      const result = await edit_comments(id, editableText); // Save updated text via API
      if (result.status === 200) {
        setOriginalText(editableText); // Update the original text with the new text
        setIsEditing(false); // Exit editing mode
      } else {
        alert("Failed to save edited comment. Response:" + result);
      }
    } catch (error) {
      alert("Error saving edited comment:" + error);
    }
  };

  const handleCancelEdit = () => {
    setEditableText(originalText); // Revert editable text to the original text
    setIsEditing(false); // Exit editing mode
  };

  const handleDelete = async () => {
    const result = await delete_comment(id); // Delete comment via API
    if (result.status === 200) {
      setRender(false); // Remove the comment from the UI
    }
  };

  if (!render) {
    return null; // Do not render if the comment has been deleted
  }

  return (
    <div
      key={index}
      className="p-4 bg-slate-100 mt-2 rounded-lg drop-shadow"
    >
      <div className="flex">
        <p className="font-medium text-emerald-600">@{username}:</p>
        {isEditing ? (
          <textarea
            value={editableText}
            onChange={(e) => setEditableText(e.target.value)}
            className="ml-2 w-full border border-gray-300 rounded-md"
          />
        ) : (
          <p className="ml-1">{originalText}</p>
        )}
      </div>
      <p className="italic text-customGreenLight">{selectedText}</p>
      <div className="flex justify-between">
        <p className="text-gray-500 truncate text-xs hover:text-gray-600 hover:underline">
          <a target="_blank" rel="noopener noreferrer" href={url}>
            {url}
          </a>
        </p>
        {isUser && (
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  className="rounded bg-green-500 text-white px-2 py-1 text-xs"
                  onClick={handleSaveEdit}
                >
                  Save
                </button>
                <button
                  className="rounded bg-gray-300 text-black px-2 py-1 text-xs"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  className="rounded bg-blue-500 text-white px-2 py-1 text-xs"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
                <button
                  className="rounded bg-red-500 text-white px-2 py-1 text-xs"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
