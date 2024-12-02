import { sendToBackground } from "@plasmohq/messaging";
import React, { useState, useEffect } from "react";
import { CommentBubble } from "../components/CommentBubble";
import { useNavigate } from "react-router-dom";

interface Comment {
  id: string;
  owner_id: string;
  username: string;
  text: string;
  css_selector?: string;
  text_offset_start?: number;
  text_offset_end?: number;
  isFollowerComment?: boolean;
  highlight?: string;
  color?: string
}
export const Sidebar = ({setSidebarVisible}) => {
const navigate = useNavigate();
console.log("sidebar");
  const [sideComments, setSideComments] = useState<Comment[]>([]);
  const userColor = "#FFD700";
  const followerColors: Record<string, string> = {};
  const colorPalette = ["#ADD8E6", "#90EE90", "#FFB6C1", "#FFA07A", "#9370DB"];

  const assignFollowerColor = (owner_id: string) => {
    if (!followerColors[owner_id]) {
      const assignedIndex = Object.keys(followerColors).length % colorPalette.length;
      followerColors[owner_id] = colorPalette[assignedIndex];
    }
    return followerColors[owner_id];
  };


  const handleSideBarClose = () => {
    setSidebarVisible(false);
    navigate("/");
  };

  async function getAndDisplayComments() {
    const response = await sendToBackground({
      name: "get_url_comments",
      body: { url: location.href },
    });
    console.log("Response from background:", response);
    const mainUserId = "main_user";

    const commentsWithFollowerFlag: Comment[] = response.sideComments.map((comment: any) => ({
      ...comment,
      isFollowerComment: comment.owner_id !== mainUserId,
    }));
    setSideComments(commentsWithFollowerFlag);

  }
  function wrapTextInSpan(cssSelector, selectedText, textOffsetStart, textOffsetEnd, comment, username, color) {
    const toRgba = (color, alpha) => {
      if (color.startsWith("#")) {
        const bigint = parseInt(color.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      } else if (color.startsWith("rgb")) {
        return color.replace("rgb", "rgba").replace(")", `, ${alpha})`);
      }
      return color;
    };
    // Select the elements based on the CSS selector passed
    const elements = document.querySelectorAll(cssSelector);
    elements.forEach((element, index) => {
      const text = element.textContent;
      if (text) {
        const beforeText = text.slice(0, textOffsetStart);
        const highlightedText = text.slice(textOffsetStart, textOffsetEnd);
        const afterText = text.slice(textOffsetEnd);

        const highlightId = `highlight-${Date.now()}-${index}`;
        const highlightSpan = document.createElement("span");
        highlightSpan.style.backgroundColor = toRgba(color, 0.3); 
        highlightSpan.textContent = highlightedText;
        highlightSpan.id = highlightId;

        const newContent = document.createDocumentFragment();
        newContent.appendChild(document.createTextNode(beforeText));
        newContent.appendChild(highlightSpan);
        newContent.appendChild(document.createTextNode(afterText));

        element.innerHTML = "";
        element.appendChild(newContent);
        highlightSpan.addEventListener("mouseover", () => {
            highlightSpan.style.backgroundColor = toRgba(color, 1); 
          });
    
          highlightSpan.addEventListener("mouseout", () => {
            highlightSpan.style.backgroundColor = toRgba(color, 0.3);
          });
    
          highlightSpan.addEventListener("click", () => {
            highlightSpan.style.backgroundColor = toRgba(color, 1); 
            setTimeout(() => {
              highlightSpan.style.backgroundColor = toRgba(color, 0.3); 
            }, 2000);
          });
        // Add comment to sidebar
      }
    });
  }
  useEffect(() => {
    window.addEventListener("load", () => {
      chrome.runtime.onMessage.addListener((message) => {
        console.log("Message received:", message);
        if (message.action === "refresh_comments") {
          getAndDisplayComments();
        }
      });
      getAndDisplayComments();
    });
  }, []);
  console.log("SideComments state:", sideComments);

  return (
        <div className="w-full h-screen flex flex-col fixed top-0 right-0 overflow-hidden scroll-smooth border-l-slate-200 p-10 z-1000">
          <h2 className="mt-4 text-center text-xl font-bold text-customGreenDark">
            Caret Comments
          </h2>
          <div className="justify-end">
            <button
              onClick={handleSideBarClose}
              className="text-customGreenLight font-semibold hover:underline ml-1"
            >
              X
            </button>
            <div className="mt-4">
            {sideComments.map((comment, index) => (
              <CommentBubble
                key={comment.id}
                index = {index}
                color={comment.color}
                username={comment.username}
                text={comment.text}
                highlight = {comment.highlight}
                setSidebarVisible = {setSidebarVisible}
              />
            ))}
            </div>
          </div>
         
        </div>
      );
    };
