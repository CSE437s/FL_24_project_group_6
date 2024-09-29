import axios from "axios"

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
    // chrome.tabs.sendMessage(tab.id, {
    //     action: "get_css_selector"
    // }, (response) => {
    //   console.log("response")
    // })
})

console.log("hello")