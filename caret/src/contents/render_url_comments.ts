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
  // Find or create the side panel
  let sidePanel = document.getElementById("comment-popup");
  let toggleButton = document.getElementById("toggle-sidebar");
  if (!sidePanel) {
      sidePanel = document.createElement("div");
      sidePanel.id = "comment-popup";
      sidePanel.style.position = "fixed";
      sidePanel.style.bottom = "10px";
      sidePanel.style.right = "10px";
      sidePanel.style.width = "300px";
      sidePanel.style.maxHeight = "400px";
      sidePanel.style.overflowY = "auto";
      sidePanel.style.backgroundColor = "#f8f9fa";
      sidePanel.style.border = "1px solid #ccc";
      sidePanel.style.borderRadius = "8px";
      sidePanel.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
      sidePanel.style.zIndex = "10000";
      sidePanel.style.padding = "10px";
      document.body.appendChild(sidePanel);

      // Add minimize/maximize button
      toggleButton = document.createElement("button");
      toggleButton.id = "toggle-sidebar";
      toggleButton.textContent = "-";
      toggleButton.style.position = "absolute";
      toggleButton.style.top = "5px";
      toggleButton.style.right = "5px";
      toggleButton.style.border = "1px solid #ccc";
      toggleButton.style.borderRadius = "4px";
      toggleButton.style.background = "white";
      toggleButton.style.cursor = "pointer";
      toggleButton.style.fontSize = "14px";
      toggleButton.style.padding = "2px 6px";
      toggleButton.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
      toggleButton.style.transition = "all 0.3s ease";
      toggleButton.addEventListener("mouseover", () => {
        toggleButton.style.background = "#f1f1f1";
      });
      toggleButton.addEventListener("mouseout", () => {
        toggleButton.style.background = "white";
      });
      sidePanel.appendChild(toggleButton);

      // Add event listener for minimize/maximize functionality
      toggleButton.addEventListener("click", () => {
        if (sidePanel.style.display !== "none") {
          sidePanel.style.display = "none"; // Hide the sidebar
          toggleButton.textContent = "+"; // Update button to maximize
          toggleButton.style.display = "block"; // Ensure button remains visible
          toggleButton.style.position = "fixed"; // Keep button fixed
          toggleButton.style.right = "10px";
          toggleButton.style.bottom = "10px";
          document.body.appendChild(toggleButton); // Reattach button to body
        } else {
          sidePanel.style.display = "block"; // Show the sidebar
          toggleButton.textContent = "-"; // Update button to minimize
          toggleButton.style.position = "absolute"; // Reposition button back to the sidebar
          toggleButton.style.top = "5px";
          toggleButton.style.right = "5px";
          sidePanel.appendChild(toggleButton); // Reattach button to the sidebar
        }
      });
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
          highlightSpan.title = comment;
          highlightSpan.id = highlightId; // Assign the unique ID

          // Add click-to-scroll behavior
          highlightSpan.addEventListener("click", (e) => {
              e.preventDefault();
              highlightSpan.scrollIntoView({ behavior: "smooth", block: "center" });
          });

          // Replace the original text in the DOM
          const newContent = document.createDocumentFragment();
          newContent.appendChild(document.createTextNode(beforeText));
          newContent.appendChild(highlightSpan);
          newContent.appendChild(document.createTextNode(afterText));
          element.innerHTML = ""; // Clear the element
          element.appendChild(newContent);

          // Add the comment to the side panel
          const commentEntry = document.createElement("div");
          commentEntry.style.marginBottom = "10px";
          commentEntry.style.borderBottom = "1px solid #ddd";
          commentEntry.style.paddingBottom = "10px";

          // Add clickable link to navigate to highlighted text
          const commentLink = document.createElement("a");
          commentLink.href = `#${highlightId}`; // Link to the highlighted text
          commentLink.style.textDecoration = "none";
          commentLink.style.color = "inherit";

          // Add a smooth scrolling behavior when clicking on the comment
          commentLink.addEventListener("click", (e) => {
              e.preventDefault();
              const targetElement = document.getElementById(highlightId);
              if (targetElement) {
                  targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
              }
          });

          // Format comment in the desired style
          const formattedComment = document.createElement("div");
          formattedComment.style.whiteSpace = "pre-line";

          // Add username
          const usernameDisplay = document.createElement("p");
          usernameDisplay.textContent = `@${username}:`;
          usernameDisplay.style.fontWeight = "bold";
          usernameDisplay.style.marginBottom = "5px";

          // Add timestamp
          const timestamp = new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
          }) + ` ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
          const timestampDisplay = document.createElement("p");
          timestampDisplay.textContent = timestamp;
          timestampDisplay.style.color = "#555";
          timestampDisplay.style.fontSize = "12px";
          timestampDisplay.style.marginBottom = "5px";

          // Add the selected text (with italics and highlight)
          const highlightedTextDisplay = document.createElement("p");
          highlightedTextDisplay.textContent = highlightedText; // Display the selected text
          highlightedTextDisplay.style.marginBottom = "5px";
          highlightedTextDisplay.style.fontStyle = "italic";
          highlightedTextDisplay.style.backgroundColor = color || "yellow";
          highlightedTextDisplay.style.padding = "2px 4px";
          highlightedTextDisplay.style.borderRadius = "4px";

          // Add the comment text
          const commentText = document.createElement("p");
          commentText.textContent = comment; // Show the user's comment
          commentText.style.marginBottom = "5px";

          // Append elements to formatted comment
          formattedComment.appendChild(usernameDisplay);
          formattedComment.appendChild(timestampDisplay);
          formattedComment.appendChild(commentText);
          formattedComment.appendChild(highlightedTextDisplay);

          // Append formatted comment to the clickable link
          commentLink.appendChild(formattedComment);

          // Append the comment entry to the side panel
          commentEntry.appendChild(commentLink);
          sidePanel.appendChild(commentEntry);
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
