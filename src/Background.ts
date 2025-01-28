
function polling() {
    console.log("polling");
    setTimeout(polling, 1000 * 30);
  }
  
  polling();

  chrome.contextMenus.create({
    title: "Sample Context Menu",
    contexts: ["all"],
    id: "contextMenu",
    
  })

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const MicrosoftFormsTab = tabs.find((tab) => tab.url?.includes("forms.office.com"));
      if (MicrosoftFormsTab && MicrosoftFormsTab.id) {
        chrome.tabs.sendMessage(MicrosoftFormsTab.id, { command: "start" });
      }
    });
  });