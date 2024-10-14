import type { PlasmoGetInlineAnchor } from "plasmo";
import React, { useState } from "react";

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => {
    return document.querySelector("body");
};

const LoginRequiredPopup = () => {
    const [isMounted, setIsMounted] = useState(false);

    // Function to close the popup
    const handleClose = () => {
        setIsMounted(false);
    };

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log(message)
        if (message.action === "log_in_message") {
            setIsMounted(true)
        }
    })

    if (!isMounted) {
        return null; // Do not render the popup if not mounted
    }

    return (
        <div
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
            }}
        >
            <h2 style={{ color: "#f44336" }}>Login Required</h2>
            <p>You must log in by clicking the caret icon to access this feature.</p>
            <button
                onClick={handleClose}
                style={{
                    padding: "10px 15px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                }}
            >
                Close
            </button>
        </div>
    );
};

export default LoginRequiredPopup;

