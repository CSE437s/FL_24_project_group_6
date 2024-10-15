import type { PlasmoGetInlineAnchor } from "plasmo";
import { sendToBackground } from "@plasmohq/messaging"
import React, { useState } from 'react';



// export const getInlineAnchor: PlasmoGetInlineAnchor = async () => {
//     return document.querySelector('body')
// }
export {}
async function get_and_display_comments() {
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
      console.log("wrapped")
      wrapTextInSpan(comments[i].css_selector, comments[i].text, comments[i].text_offset_start, comments[i].text_offset_end, comments[i].text)
      
  }
}

window.addEventListener("load", async () => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message)
    if (message.action === "refresh_comments") {
      get_and_display_comments()
    }
  })
    get_and_display_comments()
  })

  
  function wrapTextInSpan(cssSelector, selectedText, textOffsetStart, textOffsetEnd, comment) {
    // Select the element using the CSS selector
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
          span.style.textDecorationLine = "underline";
          span.style.textDecorationColor = "green";  // Optional: Add some styling for the <span>
          span.style.position = "relative"; // Necessary for positioning the tooltip

        // Create the tooltip element
        const tooltip = document.createElement("div");
        tooltip.textContent = comment; // The text to display in the tooltip
        tooltip.style.position = "absolute";
        tooltip.style.backgroundColor = "white";
        tooltip.style.border = "1px solid black";
        tooltip.style.padding = "5px";
        tooltip.style.zIndex = "1000";
        tooltip.style.display = "none"; // Initially hidden

        // Position the tooltip above the span
        span.onclick = function(event) {
            console.log("clicked")
            // Toggle tooltip visibility
            tooltip.style.display = tooltip.style.display === "none" ? "block" : "none";
  
            // Get the position of the span
            tooltip.style.top = `-40px`; // Position above the span
            tooltip.style.left = `0px`; // Align with the span
          };
        // Append the tooltip to the span
        span.appendChild(tooltip);
  
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
