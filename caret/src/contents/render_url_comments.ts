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
  const colors = ["green", "orange", "purple"]
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
