import { sendToBackground } from "@plasmohq/messaging";

let comments = [];
const userColor = "#FFD700";
const followerColors = {};
const colorPalette = [
  "#ADD8E6",
  "#90EE90",
  "#FFB6C1",
  "#FFA07A",
  "#9370DB",
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

  const mainUserId = "main_user"; 

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
  repositionCommentBubbles(); // Reposition comment bubbles after adding new comments
}

function repositionCommentBubbles() {
  const sidebar = document.getElementById("comment-sidebar");
  if (!sidebar) return;

  const commentBubbles = Array.from(sidebar.children).filter(
    (child) => child !== sidebar.firstChild
  );

  let lastBubbleBottom = 0;

  commentBubbles.forEach((bubble) => {
    const bubbleRect = bubble.getBoundingClientRect();
    const bubbleTop = bubbleRect.top + window.scrollY;

    if (bubbleTop < lastBubbleBottom) {
      const overlap = lastBubbleBottom - bubbleTop;
      (bubble as HTMLElement).style.top = `${bubbleTop + overlap}px`;
    }

    lastBubbleBottom = bubble.getBoundingClientRect().bottom + window.scrollY + 10; // 10px margin
  });
}

window.addEventListener("load", async () => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "refresh_comments") {
      get_and_display_comments();
    }
  });
  get_and_display_comments();
});

// Debounce function to limit the rate at which repositionCommentBubbles is called
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

window.addEventListener("scroll", debounce(repositionCommentBubbles, 100));

function wrapTextInSpan(
  cssSelector,
  selectedText,
  textOffsetStart,
  textOffsetEnd,
  comment,
  username,
  color
) {
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
    sidebar.style.overflowY = "hidden";
    sidebar.style.scrollBehavior = "smooth";
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
      highlightSpan.style.backgroundColor = toRgba(color, 0.3); 
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
      commentBubble.style.border = `1px solid ${color}`;
      commentBubble.style.borderRadius = "8px";
      commentBubble.style.backgroundColor = toRgba(color, 0.1); 
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
        const relativeTop = pageOffset - window.scrollY;

        commentBubble.style.top = `${relativeTop}px`;
      };

      syncPosition();
      window.addEventListener("scroll", syncPosition);

      highlightSpan.addEventListener("mouseover", () => {
        highlightSpan.style.backgroundColor = toRgba(color, 1); 
        commentBubble.style.backgroundColor = toRgba(color, 1); 
        commentBubble.style.border = `2px solid ${color}`; 
        commentBubble.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.2)"; 
      });

      highlightSpan.addEventListener("mouseout", () => {
        highlightSpan.style.backgroundColor = toRgba(color, 0.3); 
        commentBubble.style.backgroundColor = toRgba(color, 0.1); 
        commentBubble.style.border = `1px solid ${color}`; 
        commentBubble.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)"; 
      });

      highlightSpan.addEventListener("click", () => {
        commentBubble.scrollIntoView({ behavior: "smooth", block: "center" });
        highlightSpan.style.backgroundColor = toRgba(color, 1); 
        setTimeout(() => {
          highlightSpan.style.backgroundColor = toRgba(color, 0.3); 
        }, 2000);
      });

      commentBubble.addEventListener("mouseover", () => {
        highlightSpan.style.backgroundColor = toRgba(color, 1); 
        commentBubble.style.backgroundColor = toRgba(color, 1); 
        commentBubble.style.border = `2px solid ${color}`; 
        commentBubble.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.2)"; 
      })

      commentBubble.addEventListener("mouseout", () => {
        highlightSpan.style.backgroundColor = toRgba(color, 0.3); 
        commentBubble.style.backgroundColor = toRgba(color, 0.1); 
        commentBubble.style.border = `1px solid ${color}`; 
        commentBubble.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)"; 
      });

      commentBubble.addEventListener("click", () => {
        highlightSpan.scrollIntoView({ behavior: "smooth", block: "center" });
        highlightSpan.style.backgroundColor = toRgba(color, 1); 
        setTimeout(() => {
          highlightSpan.style.backgroundColor = toRgba(color, 0.3); 
        }, 2000);
      });
    }
  });

}
