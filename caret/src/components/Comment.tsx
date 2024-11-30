import { delete_comment, edit_comment } from "~api";
import { useState } from "react";

export const Comment = ({ isUser, index, username, text, url, selectedText, id }) => {
  const [render, setRender] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Track if in edit mode
  const [newText, setNewText] = useState(text); // Store the edited text

  const handleDelete = async () => {
    const result = await delete_comment(id);
    if (result.status === 200) {
      setRender(false); // Remove the comment from the UI
    }
  };

  const handleSave = async () => {
    try {
      const result = await edit_comment(id, newText);
      if (result.status === 200) {
        setIsEditing(false); // Exit edit mode
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      alert("Error updating comment. Please try again. " + error);
    }
  };

  const handleCancel = () => {
    setNewText(text); // Reset to the original text
    setIsEditing(false); // Exit edit mode
  };

  if (render) {
    return (
      <div
        key={index}
        className="p-4 bg-slate-100 mt-2 rounded-lg drop-shadow"
      >
        <div className="flex">
          <p className="font-medium text-emerald-600">@{username}:</p>
          {isEditing ? (
            <textarea
              className="ml-2 p-1 border rounded w-full"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
            />
          ) : (
            <p className="ml-1">{newText}</p>
          )}
        </div>
        <p className="italic text-customGreenLight">{selectedText}</p>
        <div className="flex justify-between items-center">
          <p className="text-gray-500 truncate text-xs hover:text-gray-600 hover:underline">
            <a target="_blank" rel="noopener noreferrer" href={url}>
              {url}
            </a>
          </p>
          {isUser && (
            <div className="flex flex-col items-end gap-2">
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    className="px-2 py-1 bg-gray-500 text-white rounded"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <button
                    className="rounded inline-flex items-center bg-transparent text-customGreenDark"
                    aria-label="Edit"
                    onClick={() => setIsEditing(true)} // Enter edit mode
                  >
                    <svg
                      className="fill-current w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.06,3.44,16.6,6l-10,10H4.06V13.4ZM3,15.94V19H6.06l11-11L14,4.94ZM20,5.61l-.79-.79a1,1,0,0,0-1.41,0L17,6.66l1.44,1.44,1.41-1.41A1,1,0,0,0,20,5.61Z" />
                    </svg>
                  </button>
                  <button
                    className="rounded inline-flex items-center bg-transparent text-customGreenDark"
                    aria-label="Delete"
                    onClick={handleDelete}
                  >
                    <svg
                      className="fill-current w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z"></path>
                    </svg>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};
