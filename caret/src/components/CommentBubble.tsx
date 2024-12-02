import { useState, useEffect } from "react";

export const CommentBubble = ({ color, index, username, text, highlight, setSidebarVisible }) => {
  const [relativeTop, setRelativeTop] = useState(0);
  console.log("comment bubble!");
  const syncPosition = () => {
    if (highlight) {
        const rect = highlight.getBoundingClientRect();
        const pageOffset = window.scrollY + rect.top;
        const relative = pageOffset - window.scrollY;
        setRelativeTop(relative);
      } else {
        console.warn("Highlight not found for syncing position");
      }
  };

  useEffect(() => {
    window.addEventListener("scroll", syncPosition);
    return () => {
      window.removeEventListener("scroll", syncPosition);
    };
  }, []);

  const toRgba = (colorName, alpha) => {
    if (colorName.startsWith("#")) {
      const bigint = parseInt(colorName.slice(1), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } else if (colorName.startsWith("rgb")) {
      return colorName.replace("rgb", "rgba").replace(")", `, ${alpha})`);
    }
    return colorName;
  };
const handleVisibility = () => {
    setSidebarVisible(true);
}
  const commentBg = toRgba(color, 0.1);


  const timestamp = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }) + ` ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

    return (
      <div
        key={index}
        className="p-4 bg-slate-100 mt-2 rounded-lg drop-shadow z-10001"
        style={{
          top: `${relativeTop}px`,
          backgroundColor: commentBg,
          border: `2px solid ${color}`,
        }}
      >
        <div className="flex">
          <p className="font-medium text-emerald-600">@{username}:</p>
          <p className="text-gray-500 text-sm mt-5 mb-5">{timestamp}</p>
          <p className="ml-1">{text}</p>
        </div>
        <button onClick = {handleVisibility} className="italic text-customGreenLight">{text}</button>
      </div>
    );
};
