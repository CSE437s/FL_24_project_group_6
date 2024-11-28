import type { PlasmoGetInlineAnchor } from "plasmo";
import { sendToBackground } from "@plasmohq/messaging";
import React, { useState } from "react";
import { wrap } from "module";
import { start } from "repl";

export {};

let comments = [];
const userColor = "#FFD700"; // Gold color for user comments
const followerColors = {}; // Store unique colors for followers
const colorPalette = [
  "#ADD8E6", // Light blue
  "#90EE90", // Light green
  "#FFB6C1", // Light pink
  "#FFA07A", // Light salmon
  "#9370DB", // Medium purple
];

const assignFollowerColor = (owner_id) => {
  if (!owner_id) {
    console.warn("Owner ID is missing. Assigning temporary unique ID.");
    owner_id = `temp-${Date.now()}-${Math.random()}`; // Temporary unique ID
  }

  if (!followerColors[owner_id]) {
    const assignedIndex = Object.keys(followerColors).length % colorPalette.length;
    followerColors[owner_id] = colorPalette[assignedIndex];
    console.log(`Assigned new color to owner_id ${owner_id}: ${followerColors[owner_id]}`);
  } else {
    console.log(`Color already assigned to owner_id ${owner_id}: ${followerColors[owner_id]}`);
  }

  return followerColors[owner_id];
};


async function get_and_display_comments() {
  let response = await sendToBackground({
    name: "get_url_comments",
    body: {
      url: location.href,
    },
  });

  const mainUserId = "main_user"; // Replace with logic to get the main user's ID

  // Derive `isFollowerComment` for each comment
  const commentsWithFollowerFlag = response.comments.map((comment) => {
    return {
      ...comment,
      isFollowerComment: comment.owner_id !== mainUserId // If owner_id doesn't match the main user, it's a follower comment
    };
  });

  console.log("Processed comments:", commentsWithFollowerFlag);

  const new_comments = commentsWithFollowerFlag.filter(
    (newComment) =>
      !comments.find((existingComment) => existingComment.id === newComment.id)
  );

  for (let i = 0; i < new_comments.length; i++) {
    const comment = new_comments[i];
    const color =
      comment.isFollowerComment
        ? assignFollowerColor(comment.owner_id)
        : userColor;

    wrapTextInSpan(
      comment.css_selector,
      comment.text,
      comment.text_offset_start,
      comment.text_offset_end,
      comment.text,
      comment.username,
      color
    );
  }

  comments = commentsWithFollowerFlag;
}


window.addEventListener("load", async () => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "refresh_comments") {
      get_and_display_comments();
    }
  });
  get_and_display_comments();
});

const filterOutTooltips = (node) => {
  if (node.nodeType === Node.TEXT_NODE || node.className !== "caretTooltip") {
    return NodeFilter.FILTER_ACCEPT;
  } else {
    return NodeFilter.FILTER_REJECT;
  }
};

function wrapTextInSpan(
  cssSelector,
  selectedText,
  textOffsetStart,
  textOffsetEnd,
  comment,
  username,
  color
) {
  document.body.style.marginRight = "300px";

  let sidebar = document.getElementById("comment-sidebar");
  if (!sidebar) {
    sidebar = document.createElement("div");
    sidebar.id = "comment-sidebar";
    sidebar.style.position = "fixed";
    sidebar.style.top = "0";
    sidebar.style.right = "0";
    sidebar.style.width = "300px";
    sidebar.style.height = "100%";
    sidebar.style.overflow = "hidden"; // Prevents sidebar scrolling
    sidebar.style.backgroundColor = "white";
    sidebar.style.borderLeft = "1px solid #ddd";
    sidebar.style.zIndex = "10000";
    sidebar.style.padding = "10px";
    document.body.appendChild(sidebar);

    const sidebarTitle = document.createElement("div");
    sidebarTitle.textContent = "Caret Comments";
    sidebarTitle.style.fontSize = "18px";
    sidebarTitle.style.fontWeight = "bold";
    sidebarTitle.style.marginBottom = "10px";
    sidebarTitle.style.borderBottom = "2px solid #ddd";
    sidebarTitle.style.paddingBottom = "10px";
    sidebarTitle.style.textAlign = "center";
    sidebarTitle.style.backgroundColor = "#f8f9fa";
    sidebarTitle.style.position = "sticky";
    sidebarTitle.style.top = "0";
    sidebarTitle.style.zIndex = "10001";
    sidebar.appendChild(sidebarTitle);
  }

  const elements = document.querySelectorAll(cssSelector);
  elements.forEach((element, index) => {
    const text = element.textContent;
    if (text) {
      const beforeText = text.slice(0, textOffsetStart);
      const highlightedText = text.slice(textOffsetStart, textOffsetEnd);
      const afterText = text.slice(textOffsetEnd);

      const highlightId = `highlight-${Date.now()}-${index}`;

      const highlightSpan = document.createElement("span");
      highlightSpan.style.backgroundColor = color;
      highlightSpan.textContent = highlightedText;
      highlightSpan.id = highlightId;

      const newContent = document.createDocumentFragment();
      newContent.appendChild(document.createTextNode(beforeText));
      newContent.appendChild(highlightSpan);
      newContent.appendChild(document.createTextNode(afterText));
      element.innerHTML = "";
      element.appendChild(newContent);

      const commentBubble = document.createElement("div");
      commentBubble.style.position = "absolute";
      commentBubble.style.width = "280px";
      commentBubble.style.marginBottom = "10px";
      commentBubble.style.border = "1px solid ";
      commentBubble.style.borderRadius = "8px";
      commentBubble.style.backgroundColor = "#f8f9fa";
      commentBubble.style.padding = "10px";
      commentBubble.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
      commentBubble.style.zIndex = "10001";

      const usernameDisplay = document.createElement("p");
      usernameDisplay.textContent = `@${username}`;
      usernameDisplay.style.fontWeight = "bold";
      usernameDisplay.style.marginBottom = "5px";

      const commentText = document.createElement("p");
      commentText.textContent = comment;

      const timestamp = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }) + ` ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

      const timestampDisplay = document.createElement("p");
      timestampDisplay.textContent = timestamp;
      timestampDisplay.style.color = "#555";
      timestampDisplay.style.fontSize = "12px";
      timestampDisplay.style.marginTop = "5px";
      timestampDisplay.style.marginBottom = "5px";

      commentBubble.appendChild(usernameDisplay);
      commentBubble.appendChild(timestampDisplay);
      commentBubble.appendChild(commentText);
      sidebar.appendChild(commentBubble);

      const syncPosition = () => {
        const rect = highlightSpan.getBoundingClientRect();
        const pageOffset = window.scrollY + rect.top;
        const sidebarRect = sidebar.getBoundingClientRect();
        const relativeTop = pageOffset - window.scrollY;

        commentBubble.style.top = `${relativeTop}px`;
      };

      syncPosition();
      window.addEventListener("scroll", syncPosition);

      highlightSpan.addEventListener("mouseover", () => {
        commentBubble.style.backgroundColor = "#e3f2fd";
        commentBubble.style.border = "1px solid #2196f3";
      });

      highlightSpan.addEventListener("mouseout", () => {
        commentBubble.style.backgroundColor = "#f8f9fa";
        commentBubble.style.border = "1px solid #ccc";
      });

      highlightSpan.addEventListener("click", () => {
        commentBubble.scrollIntoView({ behavior: "smooth", block: "center" });
        commentBubble.style.backgroundColor = "#d1e7fd";
        setTimeout(() => {
          commentBubble.style.backgroundColor = "#f8f9fa";
        }, 2000);
      });

      commentBubble.addEventListener("click", () => {
        highlightSpan.scrollIntoView({ behavior: "smooth", block: "center" });
        highlightSpan.style.backgroundColor = "#d1e7fd";
        setTimeout(() => {
          highlightSpan.style.backgroundColor = color;
        }, 2000);
      });
    }
  });
}