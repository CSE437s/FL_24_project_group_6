import { sendToBackground } from "@plasmohq/messaging";
import "~style.css";

let comments = [];
let loggedInUsername;
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
    owner_id = `temp-${Date.now()}-${Math.random()}`;
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
  })

  let reponse2 = await sendToBackground({
    name: "get_logged_in_user"
  })
  loggedInUsername = reponse2.username

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
      comment.id,
      color
    );
  }

  comments = commentsWithFollowerFlag;
}

window.addEventListener("load", async () => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "refresh_comments") {
      get_and_display_comments();
    }
  });
  get_and_display_comments();
});

function wrapTextInSpan(
  cssSelector,
  selectedText,
  textOffsetStart,
  textOffsetEnd,
  comment,
  username,
  id,
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

  document.body.style.marginRight = "320px";

  let sidebar = document.getElementById("comment-sidebar");
  if (!sidebar) {
    sidebar = document.createElement("div");
    sidebar.id = "comment-sidebar";
    sidebar.className = 'fixed top-0 right-0 w-[320px] h-full overflow-y-hidden scroll-smooth bg-white z-40 p-2 border-l border-gray-400';
    /*sidebar.style.position = "fixed";
    sidebar.style.top = "0";
    sidebar.style.right = "0";
    sidebar.style.width = "300px";
    sidebar.style.height = "100%";
    sidebar.style.overflowY = "hidden";
    sidebar.style.scrollBehavior = "smooth";
    sidebar.style.backgroundColor = "white";
    sidebar.style.borderLeft = "1px solid #ddd";
    sidebar.style.zIndex = "10000";
    sidebar.style.padding = "10px";*/
    document.body.appendChild(sidebar);

    const sidebarTitle = document.createElement("div");
    sidebarTitle.textContent = "Caret Comments";
    sidebarTitle.className = 'sticky top-0 mb-10 w-full text-center text-xl py-10 bg-red font-bold text-customGreenDark z-100 border-b border-gray-400';
    //sidebarTitle.style.fontSize = "18px";
    //sidebarTitle.style.fontWeight = "bold";
    //sidebarTitle.style.marginBottom = "10px";
    //sidebarTitle.style.borderBottom = "2px solid #ddd";
    //sidebarTitle.style.paddingBottom = "10px";
    //sidebarTitle.style.textAlign = "center";
    //sidebarTitle.style.backgroundColor = "#f8f9fa";
    //sidebarTitle.style.position = "sticky";
    //sidebarTitle.style.top = "0";
    //sidebarTitle.style.zIndex = "10001";
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
      commentBubble.className = "absolute w-[280px] mt-2 pt-2 px-6 pb-4 rounded-lg drop-shadow z-30"
      //commentBubble.style.position = "absolute";
      //commentBubble.style.width = "280px";
      //commentBubble.style.marginBottom = "10px";
      commentBubble.style.border = `1px solid ${color}`;
      //commentBubble.style.borderRadius = "8px";
      commentBubble.style.backgroundColor = toRgba(color, 0.1); 
      //commentBubble.style.padding = "10px";
      //commentBubble.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
      //commentBubble.style.zIndex = "50";
      const userAndTime = document.createElement("div");
      userAndTime.className = 'flex justify-between items-center mb-2';
      const usernameDisplay = document.createElement("p");
      usernameDisplay.textContent = `@${username}`;
      usernameDisplay.className = 'font-medium text-emerald-600 mb-1';
      //usernameDisplay.style.fontWeight = "bold";
      //usernameDisplay.style.marginBottom = "5px";

      userAndTime.appendChild(usernameDisplay);
      const commentText = document.createElement("p");
      commentText.textContent = comment;

      const timestamp = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }) + ` ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

      const timestampDisplay = document.createElement("p");
      timestampDisplay.className = 'text-xs text-gray-500 mt-1 mb-1';
      timestampDisplay.textContent = timestamp;
      userAndTime.appendChild(timestampDisplay);
     // timestampDisplay.style.color = "#555";
      //timestampDisplay.style.fontSize = "12px";
      //timestampDisplay.style.marginTop = "5px";
      //timestampDisplay.style.marginBottom = "5px";
      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.style.position = "absolute"; 
      editButton.style.top = "10px"; 
      editButton.style.right = "15px"; 
      editButton.style.padding = "4px 8px";
      editButton.style.backgroundColor = toRgba(color, 0.1);
      editButton.style.color = "#000";
      editButton.style.border = "1px solid #000";
      editButton.style.borderRadius = "4px";
      editButton.style.cursor = "pointer";
      editButton.style.display = "block";
      editButton.style.fontSize = "12px";

      editButton.addEventListener("click", () => {
        const inputField = document.createElement("textarea");
        inputField.value = comment; 
        inputField.style.width = "100%";
        inputField.style.marginBottom = "5px";
      
        const saveButton = document.createElement("button");
        saveButton.textContent = "Save";
        saveButton.style.padding = "5px 10px";
        saveButton.style.marginRight = "5px";
        saveButton.style.border = "1px solid #000";
        saveButton.style.borderRadius = "4px";
        saveButton.style.cursor = "pointer";
      
        const cancelButton = document.createElement("button");
        cancelButton.textContent = "Cancel";
        cancelButton.style.padding = "5px 10px";
        cancelButton.style.border = "1px solid #000";
        cancelButton.style.borderRadius = "4px";
        cancelButton.style.cursor = "pointer";
      
        commentBubble.innerHTML = ""; 
        commentBubble.appendChild(userAndTime);
        commentBubble.appendChild(inputField);
        commentBubble.appendChild(saveButton);
        commentBubble.appendChild(cancelButton);

        cancelButton.addEventListener("click", () => {
          commentBubble.innerHTML = "";
          commentBubble.appendChild(userAndTime);
          commentBubble.appendChild(commentText);
          commentBubble.appendChild(editButton);
        });

        saveButton.addEventListener("click", async () => {
          const newText = inputField.value.trim();
          if(newText){ 
            try{
              await sendToBackground({
                name: "edit_comments", 
                body: {comment_id: id, text: newText}
              })
              commentText.textContent = newText;
              commentBubble.innerHTML = ""; 
              commentBubble.appendChild(userAndTime);
              commentBubble.appendChild(commentText);
              commentBubble.appendChild(editButton);
            }
            catch(error){
              console.error("Failed to update comment:", error);
              alert("Error updating comment. Please try again." + error);
            }
          } 
          else{
            alert("Comment text cannot be empty."); 
          }
        }); 
      });

      commentBubble.appendChild(userAndTime);
      commentBubble.appendChild(commentText);
      if (username == loggedInUsername) {
        commentBubble.appendChild(editButton); 
      }
      
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
