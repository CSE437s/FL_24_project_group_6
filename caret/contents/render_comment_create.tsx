import type { PlasmoGetInlineAnchor } from "plasmo";
import { sendToBackground } from "@plasmohq/messaging"
import React, { useState } from 'react';



export const getInlineAnchor: PlasmoGetInlineAnchor = async () => {
    return document.querySelector('body')
}

console.log("hello")

const CommentInputForm = () => {
    const [comment, setComment] = useState("");
    const [isMounted, setIsMounted] = useState(false)
    const [highlightedTextInfo, setHighlightedTextInfo] = useState({
        selectedText: "",
        cssSelector: "",
        textOffsetStart: -1,
        textOffsetEnd: -1
    })
    const handleChange = (e) => {
      setComment(e.target.value);
    };
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log(message)
        if (message.action === "show_comment_create") {
            console.log("received")
            setHighlightedTextInfo(getHighlightedTextInfo())
            setIsMounted(true)
        }
    })
  
    const handleEmitEvent = async (e) => {
        e.preventDefault(); // Prevent page refresh
      if (comment.trim()) {
        console.log(highlightedTextInfo)
        const resp = await sendToBackground({
            name: "comment_create",
            body: {
              selectedText: highlightedTextInfo.selectedText,
              cssSelector: highlightedTextInfo.cssSelector,
              textOffsetStart: highlightedTextInfo.textOffsetStart,
              textOffsetEnd: highlightedTextInfo.textOffsetEnd,
              comment: comment            }
          })
        console.log(resp)
        setIsMounted(false)
      } else {
        alert("Comment cannot be empty");
      }
    };
    if (!isMounted) {
        return null
    }
    return (
      <form
        onSubmit={handleEmitEvent}
        style={{
          backgroundColor: "white",
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "5px",
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 10000,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
        }}>
        <div>
          <textarea
            value={comment}
            onChange={handleChange}
            placeholder="Enter your comment..."
            rows="4"
            cols="50"
            required
            style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
          />
        </div>
        <div>
          <button
            type="submit"
            style={{
              padding: "8px 12px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}>
            Submit
          </button>
        </div>
      </form>
    );
  };
  
export default CommentInputForm;

function getUniqueSelector(elSrc) {
    if (!(elSrc instanceof Element)) return;
    var sSel,
      aAttr = ['name', 'value', 'title', 'placeholder', 'data-*'], // Common attributes
      aSel = [],
      // Derive selector from element
      getSelector = function(el) {
        // 1. Check ID first
        // NOTE: ID must be unique amongst all IDs in an HTML5 document.
        // https://www.w3.org/TR/html5/dom.html#the-id-attribute
        if (el.id) {
          aSel.unshift('#' + el.id);
          return true;
        }
        aSel.unshift(sSel = el.nodeName.toLowerCase());
        // 2. Try to select by classes
        if (el.className) {
          aSel[0] = sSel += '.' + el.className.trim().replace(/ +/g, '.');
          if (uniqueQuery()) return true;
        }
        // 3. Try to select by classes + attributes
        for (var i=0; i<aAttr.length; ++i) {
          if (aAttr[i]==='data-*') {
            // Build array of data attributes
            var aDataAttr = [].filter.call(el.attributes, function(attr) {
              return attr.name.indexOf('data-')===0;
            });
            for (var j=0; j<aDataAttr.length; ++j) {
              aSel[0] = sSel += '[' + aDataAttr[j].name + '="' + aDataAttr[j].value + '"]';
              if (uniqueQuery()) return true;
            }
          } else if (el[aAttr[i]]) {
            aSel[0] = sSel += '[' + aAttr[i] + '="' + el[aAttr[i]] + '"]';
            if (uniqueQuery()) return true;
          }
        }
        // 4. Try to select by nth-of-type() as a fallback for generic elements
        var elChild = el,
          sChild,
          n = 1;
        while (elChild = elChild.previousElementSibling) {
          if (elChild.nodeName===el.nodeName) ++n;
        }
        aSel[0] = sSel += ':nth-of-type(' + n + ')';
        if (uniqueQuery()) return true;
        // 5. Try to select by nth-child() as a last resort
        elChild = el;
        n = 1;
        while (elChild = elChild.previousElementSibling) ++n;
        aSel[0] = sSel = sSel.replace(/:nth-of-type\(\d+\)/, n>1 ? ':nth-child(' + n + ')' : ':first-child');
        if (uniqueQuery()) return true;
        return false;
      },
      // Test query to see if it returns one element
      uniqueQuery = function() {
        return document.querySelectorAll(aSel.join('>')||null).length===1;
      };
    // Walk up the DOM tree to compile a unique selector
    while (elSrc.parentNode) {
      if (getSelector(elSrc)) return aSel.join(' > ');
      elSrc = elSrc.parentNode;
    }
  }
  // Function to get the CSS selector of the highlighted text
function getHighlightedTextInfo() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = selection.toString();
        const element = range.startContainer.parentElement; // Get the parent element
        const cssSelector = getUniqueSelector(element);
        const textOffsetStart = range.startOffset;
        const textOffsetEnd = range.endOffset;

        return {
            selectedText,
            cssSelector,
            textOffsetStart,
            textOffsetEnd
        };
    }
    return null;
}