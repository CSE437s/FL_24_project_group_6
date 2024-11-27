import type { PlasmoGetInlineAnchor } from "plasmo";
import { sendToBackground } from "@plasmohq/messaging"
import React, { useState } from 'react';
import { wrap } from "module";
import { start } from "repl";


export {}

let comments = []

async function get_and_display_comments() {
  let response = await sendToBackground({
    name: "get_url_comments",
    body: {
        url: location.href
    }
  })
  const colors = ["#C8DB2A", "#FF7BAD", "#6FE4CC", "#185D79", "#EF4686"]
  const new_comments = response.comments.filter(newComment => 
    !comments.find(existingComment => existingComment.id === newComment.id)
  );
  console.log(new_comments)
  //console.log("going")
  for (let i = 0; i < new_comments.length; i++) {
      //console.log("wrapped" + i)
      wrapTextInSpan(new_comments[i].css_selector, new_comments[i].text, new_comments[i].text_offset_start, new_comments[i].text_offset_end, new_comments[i].text, new_comments[i].username, colors[new_comments[i].owner_id % colors.length])
      //console.log("done")
  }
  comments = response.comments
}


window.addEventListener("load", async () => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //console.log(message)
    if (message.action === "refresh_comments") {
      get_and_display_comments()
    }
  })
    get_and_display_comments()
  })

  const filterOutTooltips = (node) => {
    if (node.nodeType === Node.TEXT_NODE || node.className !== "caretTooltip") {
        return NodeFilter.FILTER_ACCEPT;
    } else {
        return NodeFilter.FILTER_REJECT;
    }
};


function wrapTextInSpan(cssSelector, selectedText, textOffsetStart, textOffsetEnd, comment, username, color) {
  // Adjust the body content to make room for the sidebar
  document.body.style.marginRight = "300px";

  // Find or create the sidebar
  let sidebar = document.getElementById("comment-sidebar");
  if (!sidebar) {
    sidebar = document.createElement("div");
    sidebar.id = "comment-sidebar";
    sidebar.style.position = "fixed";
    sidebar.style.top = "0";
    sidebar.style.right = "0";
    sidebar.style.width = "300px";
    sidebar.style.height = "100%";
    sidebar.style.overflowY = "auto"; // Enable scrolling for the sidebar
    sidebar.style.backgroundColor = "white"; // Matches the page's background
    sidebar.style.borderLeft = "1px solid #ddd";
    sidebar.style.zIndex = "10000";
    sidebar.style.padding = "10px";
    sidebar.style.boxSizing = "border-box";
    document.body.appendChild(sidebar);

    // Add a title to the sidebar
    const sidebarTitle = document.createElement("div");
    sidebarTitle.textContent = "Caret Comments";
    sidebarTitle.style.fontSize = "18px";
    sidebarTitle.style.fontWeight = "bold";
    sidebarTitle.style.marginBottom = "10px";
    sidebarTitle.style.borderBottom = "2px solid #ddd";
    sidebarTitle.style.paddingBottom = "10px";
    sidebarTitle.style.textAlign = "center";
    sidebar.appendChild(sidebarTitle);
  }

  // Highlight the selected text on the webpage
  const elements = document.querySelectorAll(cssSelector);
  elements.forEach((element, index) => {
    const text = element.textContent;
    if (text) {
      const beforeText = text.slice(0, textOffsetStart);
      const highlightedText = text.slice(textOffsetStart, textOffsetEnd);
      const afterText = text.slice(textOffsetEnd);

      // Create a unique ID for the highlighted text
      const highlightId = `highlight-${Date.now()}-${index}`;

      // Create a wrapper span for the highlighted text
      const highlightSpan = document.createElement("span");
      highlightSpan.style.backgroundColor = color || "yellow";
      highlightSpan.textContent = highlightedText;
      highlightSpan.id = highlightId; // Assign the unique ID

      // Replace the original text in the DOM
      const newContent = document.createDocumentFragment();
      newContent.appendChild(document.createTextNode(beforeText));
      newContent.appendChild(highlightSpan);
      newContent.appendChild(document.createTextNode(afterText));
      element.innerHTML = ""; // Clear the element
      element.appendChild(newContent);

      // Create the comment bubble
      const commentBubble = document.createElement("div");
      commentBubble.style.position = "absolute"; // Allow precise placement
      commentBubble.style.width = "280px";
      commentBubble.style.marginBottom = "10px";
      commentBubble.style.border = "1px solid #ccc";
      commentBubble.style.borderRadius = "8px";
      commentBubble.style.backgroundColor = "#f8f9fa";
      commentBubble.style.padding = "10px";
      commentBubble.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
      commentBubble.style.zIndex = "10001";

      // Add a highlight effect class to the bubble
      commentBubble.classList.add("comment-bubble");

      // Add content to the comment bubble
      const usernameDisplay = document.createElement("p");
      usernameDisplay.textContent = `@${username}`;
      usernameDisplay.style.fontWeight = "bold";
      usernameDisplay.style.marginBottom = "5px";

      const timestamp = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }) + ` ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
      const timestampDisplay = document.createElement("p");
      timestampDisplay.textContent = timestamp;
      timestampDisplay.style.color = "#555";
      timestampDisplay.style.fontSize = "12px";
      timestampDisplay.style.marginBottom = "5px";

      const commentText = document.createElement("p");
      commentText.textContent = comment;

      // Append username, timestamp, and comment to the bubble
      commentBubble.appendChild(usernameDisplay);
      commentBubble.appendChild(timestampDisplay);
      commentBubble.appendChild(commentText);

      // Append the bubble to the sidebar
      sidebar.appendChild(commentBubble);

      // Synchronize position with the highlighted text
      const syncPosition = () => {
        const rect = highlightSpan.getBoundingClientRect();
        const pageOffset = window.scrollY + rect.top;

        // Adjust the bubble's position relative to the sidebar
        const sidebarRect = sidebar.getBoundingClientRect();
        const relativeTop = pageOffset - window.scrollY;

        commentBubble.style.top = `${relativeTop}px`;
      };

      // Initial positioning
      syncPosition();

      // Update position on scroll
      window.addEventListener("scroll", syncPosition);

      // Highlight the comment bubble on hover
      highlightSpan.addEventListener("mouseover", () => {
        commentBubble.style.backgroundColor = "#e3f2fd"; // Light blue background
        commentBubble.style.border = "1px solid #2196f3"; // Blue border
      });

      // Remove highlight when the mouse leaves the highlighted text
      highlightSpan.addEventListener("mouseout", () => {
        commentBubble.style.backgroundColor = "#f8f9fa"; // Reset background
        commentBubble.style.border = "1px solid #ccc"; // Reset border
      });

      // Highlight the comment bubble when the highlighted text is clicked
      highlightSpan.addEventListener("click", () => {
        commentBubble.scrollIntoView({ behavior: "smooth", block: "center" });
        commentBubble.style.backgroundColor = "#d1e7fd"; // Highlight background
        setTimeout(() => {
          commentBubble.style.backgroundColor = "#f8f9fa"; // Reset background after a delay
        }, 2000);
      });

      // Highlight the text when the comment bubble is clicked
      commentBubble.addEventListener("click", () => {
        highlightSpan.scrollIntoView({ behavior: "smooth", block: "center" });
        highlightSpan.style.backgroundColor = "#d1e7fd"; // Highlight background
        setTimeout(() => {
          highlightSpan.style.backgroundColor = color || "yellow"; // Reset background after a delay
        }, 2000);
      });

      // Highlight the text when hovering over the comment bubble
      commentBubble.addEventListener("mouseover", () => {
        highlightSpan.style.backgroundColor = "#d1e7fd"; // Highlight background
      });

      commentBubble.addEventListener("mouseout", () => {
        highlightSpan.style.backgroundColor = color || "yellow"; // Reset background
      });
    }
  });
}


/*

function wrapTextInSpan(cssSelector, selectedText, textOffsetStart, textOffsetEnd, comment, username, color) {
  // Select the element using the CSS selector
  const element = document.querySelector(cssSelector);

  if (element) {
    // Loop through child nodes to find the target text node
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, filterOutTooltips);
    let currentNode: Node;
    let currentOffset = 0;
    let startNode, endNode, startOffset, endOffset;
     // Find the starting text node
     while ((currentNode = walker.nextNode())) {
      if (currentNode.nodeType === Node.TEXT_NODE) {
        const nodeLength = currentNode.textContent.length;

        // Check if this node contains the start position
        if (currentOffset + nodeLength >= textOffsetStart && !startNode) {
          startNode = currentNode;
          startOffset = textOffsetStart - currentOffset;
        }
  
        // Check if this node contains the end position
        if (currentOffset + nodeLength >= textOffsetEnd) {
          endNode = currentNode;
          endOffset = textOffsetEnd - currentOffset;
          break;
        }
  
        currentOffset += nodeLength;
      }
      
    }
    //console.log("start")
    //console.log(startNode)
    //console.log("end")
    //console.log(endNode)
    if (startNode && endNode) {
      const range = document.createRange();
      if (startNode === endNode || (startNode.nodeType === Node.TEXT_NODE && endNode.nodeType === Node.TEXT_NODE)) {
        ////console.log("triggered")
        range.setStart(startNode, startOffset);
        range.setEnd(endNode, endOffset);
      }
      else {
        const startWalker = document.createTreeWalker(startNode, NodeFilter.SHOW_TEXT, filterOutTooltips);
        while (startNode.nodeType !== Node.TEXT_NODE) {
          //get node after start node and set range to start there
          startNode = startWalker.nextNode()
        }
        const endWalker = document.createTreeWalker(startNode, NodeFilter.SHOW_TEXT, filterOutTooltips);
        while (endNode.nodeType !== Node.TEXT_NODE) {
          //get node before end node and set range to end there
          endNode = endWalker.previousNode()
        }
        range.setStart(startNode, 0);
        range.setEnd(endNode, 0);
      }




      // Create the <span> element
      const span = document.createElement("span");
      span.textContent = selectedText;
      span.classList.add("caretAnchorClass")
      span.style.textDecorationLine = "underline";
      span.style.textDecorationColor = color;  // Optional: Add some styling for the <span>
      span.style.position = "relative"; // Necessary for positioning the tooltip
      // Create the tooltip element
      const tooltip = document.createElement("div");

      // Structure the tooltip content with a username header and comment body
      tooltip.innerHTML = `
          <div style="font-weight: bold; margin-bottom: 5px; color: #6A8532;" id="tooltip-username">Username</div>
          <div id="tooltip-comment">${comment}</div>
      `;

      // Apply styles to the tooltip box
      tooltip.style.position = "absolute";
      tooltip.style.backgroundColor = "white";
      tooltip.style.border = "1px solid #ccc";
      tooltip.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
      tooltip.style.borderRadius = "8px";
      tooltip.style.padding = "10px";
      tooltip.style.maxWidth = "200px";  // Adjust the width if necessary
      tooltip.style.zIndex = "1000";
      tooltip.style.display = "none";  // Initially hidden
      tooltip.className = "caretTooltip"

      // You can dynamically set the username as well

      tooltip.querySelector("#tooltip-username").textContent = "@" + username + ":";

      // Position the tooltip above the span
      span.onclick = function(event) {
          ////console.log("clicked")
          // Toggle tooltip visibility
          tooltip.style.display = tooltip.style.display === "none" ? "block" : "none";

          // Get the position of the span
          tooltip.style.top = `-40px`; // Position above the span
          tooltip.style.left = `0px`; // Align with the span
        };
   
      
      // Wrap the selected range in the span element
      try {
        range.surroundContents(span);
        // Append the tooltip to the span
          span.appendChild(tooltip);
          //////console.log("Text successfully wrapped in span!");3
      }
      catch(e) {
        //////console.log("issue wrapping:")
        ////console.log(e)
      }
      
         

    } else {
      console.error("Could not locate text range to wrap.");
    }
  }
}
*/

  // function wrapTextInSpan(cssSelector, selectedText, textOffsetStart, textOffsetEnd, comment, username, color) {
  //   // Select the element using the CSS selector
  //   const element = document.querySelector(cssSelector);
  
  //   if (element) {
  //     // Loop through child nodes to find the target text node
  //     const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, filterOutTooltips);
  //     let currentNode;
  //     let currentIndex = 0;
  
  //     while (currentNode = walker.nextNode()) {
  //       const textContent = currentNode.nodeValue;
  
  //       // If the selected text falls within this node
  //       const nodeLength = textContent.length;
  //       if (currentIndex + nodeLength >= textOffsetStart && currentIndex <= textOffsetEnd) {
  //         // Split the text node into parts
  //         const beforeText = textContent.substring(0, textOffsetStart - currentIndex);
  //         const selectedSpanText = textContent.substring(textOffsetStart - currentIndex, textOffsetEnd - currentIndex);
  //         const afterText = textContent.substring(textOffsetEnd - currentIndex);
  
  //         // Create the <span> element
  //         const span = document.createElement("span");
  //         span.textContent = selectedSpanText;
  //         span.classList.add("caretAnchorClass")
  //         span.style.textDecorationLine = "underline";
  //         span.style.textDecorationColor = color;  // Optional: Add some styling for the <span>
  //         span.style.position = "relative"; // Necessary for positioning the tooltip

  //       // Create the tooltip element
  //       const tooltip = document.createElement("div");

  //       // Structure the tooltip content with a username header and comment body
  //       tooltip.innerHTML = `
  //           <div style="font-weight: bold; margin-bottom: 5px; color: #333;" id="tooltip-username">Username</div>
  //           <div style="color: #555;" id="tooltip-comment">${comment}</div>
  //       `;

  //       // Apply styles to the tooltip box
  //       tooltip.style.position = "absolute";
  //       tooltip.style.backgroundColor = "white";
  //       tooltip.style.border = "1px solid #ccc";
  //       tooltip.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
  //       tooltip.style.borderRadius = "8px";
  //       tooltip.style.padding = "10px";
  //       tooltip.style.maxWidth = "200px";  // Adjust the width if necessary
  //       tooltip.style.zIndex = "1000";
  //       tooltip.style.display = "none";  // Initially hidden
  //       tooltip.className = "caretTooltip"

  //       // You can dynamically set the username as well

  //       tooltip.querySelector("#tooltip-username").textContent = username + ":";

  //       // Position the tooltip above the span
  //       span.onclick = function(event) {
  //           //console.log("clicked")
  //           // Toggle tooltip visibility
  //           tooltip.style.display = tooltip.style.display === "none" ? "block" : "none";
  
  //           // Get the position of the span
  //           tooltip.style.top = `-40px`; // Position above the span
  //           tooltip.style.left = `0px`; // Align with the span
  //         };
  //       // Append the tooltip to the span
  //       span.appendChild(tooltip);
  
  //         // Replace the original text node with before text, span, and after text
  //         const parent = currentNode.parentNode;
  //         parent.insertBefore(document.createTextNode(beforeText), currentNode);
  //         parent.insertBefore(span, currentNode);
  //         parent.insertBefore(document.createTextNode(afterText), currentNode);
  
  //         parent.removeChild(currentNode);  // Remove the original node
  //         break;
  //       }
  
  //       // Update current index for next node
  //       currentIndex += nodeLength;
  //     }
  //   } else {
  //     console.error("Element not found with the provided CSS selector.");
  //   }
  // }
