import type { PlasmoGetInlineAnchor } from "plasmo";
import { sendToBackground } from "@plasmohq/messaging";
import React, { useState, useEffect } from 'react';
import { start } from "repl";

// Define the inline anchor function
export const getInlineAnchor: PlasmoGetInlineAnchor = async () => {
    return document.querySelector('body');
}

console.log("hello");

const CommentInputForm = () => {
    const [comment, setComment] = useState<string>("");
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [highlightedTextInfo, setHighlightedTextInfo] = useState<{
        selectedText: string;
        cssSelector: string;
        textOffsetStart: number;
        textOffsetEnd: number;
    }>({
        selectedText: "",
        cssSelector: "",
        textOffsetStart: -1,
        textOffsetEnd: -1
    });

    // Define the change event type
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(e.target.value);
    };

    // Listener for messages from the background script
    useEffect(() => {
        const handleMessage = (message: any, sender: any, sendResponse: any) => {
            console.log(message);
            if (message.action === "show_comment_create") {
                console.log("received");
                setHighlightedTextInfo(getHighlightedTextInfo());
                setIsMounted(true);
            }
        };

        chrome.runtime.onMessage.addListener(handleMessage);
        
        // Cleanup listener on unmount
        return () => {
            chrome.runtime.onMessage.removeListener(handleMessage);
        };
    }, []);

    // Handle form submission
    const handleEmitEvent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent page refresh
        if (comment.trim()) {
            console.log(highlightedTextInfo);
            const resp = await sendToBackground({
                name: "comment_create",
                body: {
                    selectedText: highlightedTextInfo.selectedText,
                    cssSelector: highlightedTextInfo.cssSelector,
                    textOffsetStart: highlightedTextInfo.textOffsetStart,
                    textOffsetEnd: highlightedTextInfo.textOffsetEnd,
                    comment: comment
                }
            });
            console.log(resp);
            setIsMounted(false);
        } else {
            alert("Comment cannot be empty");
        }
    };

    if (!isMounted) {
        return null;
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
                    rows={4}
                    cols={50}
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

function getUniqueSelector(elSrc: Element): string | undefined {
    if (!(elSrc instanceof Element)) return;
    let sSel: string;
    const aAttr = ['name', 'value', 'title', 'placeholder', 'data-*']; // Common attributes
    const aSel: string[] = [];

    // Derive selector from element
    const getSelector = (el: Element) => {
        // 1. Check ID first
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
        for (const attr of aAttr) {
            if (attr === 'data-*') {
                // Build array of data attributes
                const aDataAttr = [].filter.call(el.attributes, (attr: Attr) => {
                    return attr.name.indexOf('data-') === 0;
                });
                for (const dataAttr of aDataAttr) {
                    aSel[0] = sSel += '[' + dataAttr.name + '="' + dataAttr.value + '"]';
                    if (uniqueQuery()) return true;
                }
            } else if (el[attr as keyof Element]) {
                aSel[0] = sSel += '[' + attr + '="' + el[attr as keyof Element] + '"]';
                if (uniqueQuery()) return true;
            }
        }

        // 4. Try to select by nth-of-type() as a fallback for generic elements
        let elChild = el;
        let n = 1;
        while (elChild = elChild.previousElementSibling) {
            if (elChild.nodeName === el.nodeName) ++n;
        }
        aSel[0] = sSel += ':nth-of-type(' + n + ')';
        if (uniqueQuery()) return true;

        // 5. Try to select by nth-child() as a last resort
        elChild = el;
        n = 1;
        while (elChild = elChild.previousElementSibling) ++n;
        aSel[0] = sSel = sSel.replace(/:nth-of-type\(\d+\)/, n > 1 ? ':nth-child(' + n + ')' : ':first-child');
        if (uniqueQuery()) return true;

        return false;
    };

    // Test query to see if it returns one element
    const uniqueQuery = () => {
        return document.querySelectorAll(aSel.join('>') || null).length === 1;
    };

    // Walk up the DOM tree to compile a unique selector
    while (elSrc.parentNode) {
        if (getSelector(elSrc)) return aSel.join(' > ');
        elSrc = elSrc.parentNode as Element;
    }
}

function removeAllSpans(element: Element) {
    // Use a recursive function to unwrap all <span> tags
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, null);
    let currentNode;

    while (currentNode = walker.nextNode()) {
        if (currentNode.tagName === 'SPAN' && currentNode.className === 'caretAnchorClass') {
            const parent = currentNode.parentNode;
            while (currentNode.firstChild) {
                parent.insertBefore(currentNode.firstChild, currentNode);
            }
            parent.removeChild(currentNode);
        }
    }
}

const filterOutTooltips = (node) => {
    if (node.nodeType === Node.TEXT_NODE || node.className !== "caretTooltip") {
        return NodeFilter.FILTER_ACCEPT
    }
    else {
        return NodeFilter.FILTER_REJECT
    }
}

function calculateTrueIntervals(element: Element, range: Range) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, filterOutTooltips);
    console.log("endcontainer")
    console.log(range.endContainer)
    let currentNode: Node
    console.log("starting loop")
    let totalOffset = 0
    // find the start offset
    while ((currentNode = walker.nextNode()) && (currentNode !== range.startContainer)) {
        if (currentNode.nodeType === Node.TEXT_NODE) {
            console.log(currentNode.textContent)
            totalOffset = totalOffset + currentNode.textContent.length
        }
    }
    let startOffset = range.startOffset + totalOffset 
    let endOffset = range.endOffset +  totalOffset
    console.log("start offset before while:")
    console.log(startOffset)
    console.log("end offset before while:")
    console.log(endOffset)
    while ((currentNode !== range.endContainer)) {
        console.log("current")
        console.log(currentNode)
        console.log("supposed to stop at")
        console.log(range.endContainer)
        console.log("PAY ATTENIN")
        console.log(currentNode)
        if (currentNode.nodeType === Node.TEXT_NODE) {
            console.log("end offset:")
            console.log(endOffset)
            console.log("length of text ")
            console.log(currentNode.textContent.length)
            console.log(currentNode.textContent)
            endOffset = endOffset + currentNode.textContent.length
        }
        currentNode = walker.nextNode()
    }
    console.log(startOffset)
    console.log(endOffset)
    console.log("ending loop")
    return [startOffset, endOffset]
}

// Function to get the CSS selector of the highlighted text
function getHighlightedTextInfo() {
    const selection = window.getSelection();
    console.log(selection)
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = selection.toString();
        console.log("common ancestor")
        console.log(range.commonAncestorContainer)

        console.log("range")
        console.log(range)
        let element = range.startContainer.parentElement; // Get the parent element, not a span
        if (element.className === "caretAnchorClass") [
            element = element.parentElement
        ] 

        const cssSelector = getUniqueSelector(element as Element); // Ensure correct type
        console.log(cssSelector)
        const [textOffsetStart, textOffsetEnd] = calculateTrueIntervals(element, range)
        return {
            selectedText,
            cssSelector,
            textOffsetStart,
            textOffsetEnd
        };
    }
    return null;
}
