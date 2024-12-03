import type { PlasmoGetInlineAnchor } from "plasmo";
import { sendToBackground } from "@plasmohq/messaging"
import React, { useState } from 'react';

// export const getInlineAnchor: PlasmoGetInlineAnchor = async () => {
//     return document.querySelector('body')
// }
export {}
const color = "#0f0";
const renderedCommentIds = new Set();

const userColors = {};
const colorPalette = [
  "#ADD8E6",
  "#90EE90",
  "#FFB6C1",
  "#FFA07A",
  "#9370DB",
];

const showSidebarButton = document.createElement("button");
showSidebarButton.textContent = "Show Comments";
showSidebarButton.style.position = "fixed";
showSidebarButton.style.bottom = "10px";
showSidebarButton.style.right = "10px";
showSidebarButton.style.backgroundColor = "#ffa500";
showSidebarButton.style.color = "#000";
showSidebarButton.style.border = "none";
showSidebarButton.style.borderRadius = "4px";
showSidebarButton.style.padding = "10px";
showSidebarButton.style.cursor = "pointer";
showSidebarButton.style.zIndex = "10000";
showSidebarButton.style.display = "block";

const assignUserColor = (owner_id) => {
  if (!owner_id) {
    console.warn("Owner ID is missing. Assigning temporary unique ID.");
    owner_id = `temp-${Date.now()}-${Math.random()}`; // Temporary unique ID
  }

  if (!userColors[owner_id]) {
    const assignedIndex = Object.keys(userColors).length % colorPalette.length;
    userColors[owner_id] = colorPalette[assignedIndex];
  } 

  return userColors[owner_id];
};

async function get_and_display_comments(){
  let response = await sendToBackground({
    name: "get_url_comments",
    body: {
        url: location.href
    }
  })

  const comments = response.comments
  console.log(comments)
  console.log("going")
  for (let i = 0; i < comments.length; i++) {
    if (renderedCommentIds.has(comments[i].id)) {
      continue;
    }
    console.log("wrapped")
    let color = assignUserColor(comments[i].owner_id); 
    wrapTextInSpan(comments[i], comments[i].css_selector, comments[i].text, comments[i].text_offset_start, comments[i].text_offset_end, comments[i].text, color)
    renderedCommentIds.add(comments[i].id);
  }
}
window.addEventListener("load", async () => {
  document.body.appendChild(showSidebarButton);
  showSidebarButton.addEventListener("click", () => {
    const sidebar = createSideBar(); 
    sidebar.style.display = "block"; 
    document.body.style.marginRight = "300px";
    showSidebarButton.style.display = "none"; 
  });

  get_and_display_comments();
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "refresh_comments") {
      get_and_display_comments();
    }
  });
})

  
  function wrapTextInSpan(commentObj, cssSelector, selectedText, textOffsetStart, textOffsetEnd, comment, color) {
    // Select the element using the CSS selector

    let sideBar = createSideBar()

    const element = document.querySelector(cssSelector);
  
    if (element) {
      // Loop through child nodes to find the target text node
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
      let currentNode;
      let currentIndex = 0;
  
      while (currentNode = walker.nextNode()) {
        const textContent = currentNode.nodeValue;
  
        // If the selected text falls within this node
        const nodeLength = textContent.length;
        if (currentIndex + nodeLength >= textOffsetStart && currentIndex <= textOffsetEnd) {
          // Split the text node into parts
          const beforeText = textContent.substring(0, textOffsetStart - currentIndex);
          const selectedSpanText = textContent.substring(textOffsetStart - currentIndex, textOffsetEnd - currentIndex);
          const afterText = textContent.substring(textOffsetEnd - currentIndex);
  
          // Create the <span> element
          const span = document.createElement("span");
          span.textContent = selectedSpanText;
          span.style.backgroundColor = toRgba(color, 0.2);
          span.style.position = "relative"; // Necessary for positioning the tooltip

          const commentBubble = createCommentBubble(commentObj, color, span.textContent); 
          sideBar = addBubbleToSidebar(sideBar, commentBubble)

        span.addEventListener("mouseover", () => {
          span.style.backgroundColor = toRgba(color, 1); 
          commentBubble.style.backgroundColor = toRgba(color, 1); 
          commentBubble.style.border = `2px solid ${color}`; 
          commentBubble.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.2)"; 
        });
  
        span.addEventListener("mouseout", () => {
          span.style.backgroundColor = toRgba(color, 0.3); 
          commentBubble.style.backgroundColor = toRgba(color, 0.1); 
          commentBubble.style.border = `1px solid ${color}`; 
          commentBubble.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)"; 
        });
  
        span.addEventListener("click", () => {
          span.scrollIntoView({ behavior: "smooth", block: "center" });
          commentBubble.scrollIntoView({ behavior: "smooth", block: "center" });
          span.style.backgroundColor = toRgba(color, 1); 
          setTimeout(() => {
            span.style.backgroundColor = toRgba(color, 0.3); 
          }, 2000);
        });

        commentBubble.addEventListener("mouseover", () => {
          span.style.backgroundColor = toRgba(color, 1); 
          commentBubble.style.backgroundColor = toRgba(color, 1); 
          commentBubble.style.border = `2px solid ${color}`; 
          commentBubble.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.2)"; 
        })
  
        commentBubble.addEventListener("mouseout", () => {
          span.style.backgroundColor = toRgba(color, 0.3); 
          commentBubble.style.backgroundColor = toRgba(color, 0.1); 
          commentBubble.style.border = `1px solid ${color}`; 
          commentBubble.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)"; 
        });
  
        commentBubble.addEventListener("click", () => {
          span.scrollIntoView({ behavior: "smooth", block: "center" });
          span.style.backgroundColor = toRgba(color, 1); 
          setTimeout(() => {
            span.style.backgroundColor = toRgba(color, 0.3); 
          }, 2000);
        });
  
          // Replace the original text node with before text, span, and after text
          const parent = currentNode.parentNode;
          parent.insertBefore(document.createTextNode(beforeText), currentNode);
          parent.insertBefore(span, currentNode);
          parent.insertBefore(document.createTextNode(afterText), currentNode);
  
          parent.removeChild(currentNode);  // Remove the original node
          break;

          
        }
  
        // Update current index for next node
        currentIndex += nodeLength;
      }
    } else {
      console.error("Element not found with the provided CSS selector.");
    }
  }

  function createSideBar(){
    let sidebar = document.getElementById("comment-sidebar");
    let sidebarTitle;
    if (!sidebar) {
      sidebar = document.createElement("div");
      sidebar.id = "comment-sidebar";
      sidebar.style.position = "fixed";
      sidebar.style.top = "0";
      sidebar.style.right = "0";
      sidebar.style.width = "300px";
      sidebar.style.height = "100%";
      sidebar.style.overflowY = "auto";
      sidebar.style.scrollBehavior = "smooth";
      sidebar.style.backgroundColor = "white";
      sidebar.style.borderLeft = "1px solid #ddd";
      sidebar.style.zIndex = "10000";
      sidebar.style.padding = "10px";
      sidebar.style.display = "none"
      document.body.appendChild(sidebar);
  
      sidebarTitle = document.createElement("div");
      sidebarTitle.textContent = "Caret Comments";
      sidebarTitle.style.fontSize = "18px";
      sidebarTitle.style.fontWeight = "bold";
      sidebarTitle.style.marginBottom = "10px";
      sidebarTitle.style.borderBottom = "2px solid #ddd";
      sidebarTitle.style.padding = "10px";
      sidebarTitle.style.paddingBottom = "10px";
      sidebarTitle.style.textAlign = "center";
      sidebarTitle.style.backgroundColor = "#ffa500";
      sidebarTitle.style.position = "sticky";
      sidebarTitle.style.top = "0";
      sidebarTitle.style.zIndex = "10100";
      sidebar.appendChild(sidebarTitle);

      const closeButton = document.createElement("button");
      closeButton.textContent = "X";
      closeButton.style.position = "sticky"; 
      closeButton.style.top = "10px";
      closeButton.style.right = "5px";
      closeButton.style.backgroundColor = "#ff0000";
      closeButton.style.color = "#fff";
      closeButton.style.border = "none";
      closeButton.style.borderRadius = "50%";
      closeButton.style.width = "24px";
      closeButton.style.height = "24px";
      closeButton.style.cursor = "pointer";
      closeButton.style.zIndex = "10101";

      closeButton.addEventListener("click", () => {
        sidebar.style.display = "none"; 
        showSidebarButton.style.display = "block"; 
        document.body.style.marginRight = "0px";
    });
      sidebar.appendChild(closeButton);
    } else {
      sidebarTitle = sidebar.querySelector("div");
    }

    return sidebar
  }

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

  function createCommentBubble(commentObj, color, selectedSpanText){
    const commentBubble = document.createElement("div");
    commentBubble.style.position = "absolute";
    commentBubble.style.width = "280px";
    commentBubble.style.marginBottom = "10px";
    commentBubble.style.border = `1px solid ${color}`;
    commentBubble.style.borderRadius = "8px";
    commentBubble.style.backgroundColor = toRgba(color, 0.1); 
    commentBubble.style.padding = "10px";
    commentBubble.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
    commentBubble.style.zIndex = "10001";
    commentBubble.style.overflow = "visible"; 
    commentBubble.style.display = "flex"; 
    commentBubble.style.flexDirection = "column"; 
    
    const usernameDisplay = document.createElement("p");
    usernameDisplay.textContent = `@${commentObj.username}`;
    usernameDisplay.style.fontWeight = "bold";
    usernameDisplay.style.marginBottom = "5px";

    const commentText = document.createElement("p");
    commentText.textContent = commentObj.text;

    const highlightText = document.createElement("p");
    highlightText.textContent = selectedSpanText;
    highlightText.style.fontStyle = "italic"; 
    highlightText.style.backgroundColor = toRgba("#000", 0.1);

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
    commentBubble.appendChild(highlightText);

    return commentBubble
  }

  function addBubbleToSidebar(sidebar, commentBubble) {
    commentBubble.style.marginBottom = "10px"; 
    commentBubble.style.position = "relative";
    sidebar.appendChild(commentBubble);
    return sidebar
}



// const InlineCommentHighlight = async () => {
//     const [isMounted, setIsMounted] = useState(false)
//     const [fetchState, setFetchState] = useState("unfetched")
//     const [comments, setComments] = useState([])

    
//     if (fetchState === "unfetched") {
//         setFetchState("fetching")
        
//         console.log(fetchedComments.comments)
//         setComments(fetchedComments.comments)
//         setFetchState("fetched")
//     }
    
//     if (!isMounted) {
//         return null
//     }
//     return (
//       <button>Hello</button>
//     );
//   };
  
// export default InlineCommentHighlight;