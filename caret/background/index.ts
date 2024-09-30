import axios from "axios"
import { get_url_comments } from "~api"

// this is the logic to add a create caret to the right click menu when the extension is installed
chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
      title: 'Create caret',
      contexts: ["selection"],
      id: "create_caret"
    })
  })


// this is the logic that is triggered when the create caret right click is clicked
chrome.contextMenus.onClicked.addListener(async function (info, tab) {
  chrome.tabs.sendMessage(tab.id, {
      action: "show_comment_create"
    })
})

// //this logic runs whenever a user goes to a new url
// chrome.tabs.onUpdated.addListener(
//   async function(tabId, changeInfo, tab) {
//     if (changeInfo.status === 'complete') {
//       //get all the comments that are on that url
//       console.log("url changed")
//       await new Promise(r => setTimeout(r, 1000));
//       try {
//         let comments = await get_url_comments(changeInfo.url)
//         chrome.tabs.sendMessage(tabId, {
//           action: "display_comments_on_url",
//           comments: comments.data
//         })
//         console.log("data sent")
//       }
//       catch {
//         console.log("comment fetch failed")
//       }
      
      
//     }
//   }
// )