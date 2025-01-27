import { clipboard } from "@extend-chrome/clipboard";

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text) {
        console.log(msg.text);
          clipboard.writeText(msg.text)
    }
  
  });

