import { Actions } from "./chrome/actions";
import { ChromeEngine } from "./chrome";
import { ChromeMessage } from "./types";
import { ClaudeReversed } from "./ai-agents/Claude";
import { Cloudflare } from "./ai-agents/Cloudflare";

class ChromeBackgroundEngine {
  constructor() {
    this.createContextMenu();
    this.registerContextMenuListener();
    this.registerMessageListener();
  }
  private createContextMenu() {
    chrome.contextMenus.create({
      title: "Claude",
      contexts: ["all"],
      id: "claude",
    });

    chrome.contextMenus.create({
      title: "Deepseek R-1",
      contexts: ["all"],
      id: "dsr1",
    });

    chrome.contextMenus.create({
      title: "debug",
      contexts: ["all"],
      id: "debug",
    });
    chrome.contextMenus.create({
      title: "clear storage",
      contexts: ["all"],
      id: "storage",
    });
  }
  private registerContextMenuListener() {
    chrome.contextMenus.onClicked.addListener((info, tab) => {
      /*
       * Debugging purposes Will be removed in the final version
       */
      if (info.menuItemId === "debug") {
        ChromeEngine.getLocalStorage(
          "ClaudeReversedConversationIdWithForm"
        ).then((res) => {
          console.log(res);
        });
        return;
      }
      if (info.menuItemId === "storage") {
        console.log("clearing storage");

        chrome.storage.sync.clear();

        return;
      }
      if (tab && tab.id) {
        chrome.tabs.sendMessage<ChromeMessage>(tab.id, {
          command: Actions.start,
          data: {
            agent: info.menuItemId,
            service: new URL(tab.url || "").hostname,
          },
        });
      }
    });
  }

  private registerMessageListener() {
    chrome.runtime.onMessage.addListener(
      async (message: ChromeMessage, _sender, _response) => {
        const { command, data } = message;

        let DataToBeSetIntoClipboard: string[] = [];
        if (command === Actions.claude) {
          const Agent = await ClaudeReversed.getInstance(data.formId);
          // Retry logic to ensure the conversationId is fetched properly before proceeding
          // The code will try to retrieve the conversationId up to a maximum number of retries (maxRetries).
          // If the conversationId is not available, it will retry after a delay (retryDelay) until the maxRetries is reached.
          // If the conversationId is not fetched after the maximum retries, the function will log a failure message and stop.
          // The delay between retries helps avoid flooding the server with requests in a short time.
          const maxRetries = 5;
          const retryDelay = 2000;
          let retries = 0;
          let conversationIdReady = false;

          while (retries < maxRetries && !conversationIdReady) {
            if (Agent.conversationId) {
              conversationIdReady = true;
            } else {
              retries++;
              console.log(
                `Retry ${retries}/${maxRetries}... waiting for conversationId`
              );
              await ChromeEngine.Sleep(retryDelay);
            }
          }

          if (!conversationIdReady) {
            console.log("Failed to get conversationId after retries");
            return;
          }
          DataToBeSetIntoClipboard = await Agent.Start(data.message);
        }
        if (command === Actions.dsr1) {
          const Agent = new Cloudflare();
          DataToBeSetIntoClipboard = await Agent.Start(data.message);
        }
        const tabId = await ChromeEngine.getTabIdByURL(data.service);
        if (tabId) {
          this.sendMessageToTab(tabId, {
            command: Actions.setClipboard,
            data: DataToBeSetIntoClipboard,
          });
        }
      }
    );
  }

  private sendMessageToTab(tabId: number, message: ChromeMessage) {
    chrome.tabs.sendMessage(tabId, message);
  }
}

new ChromeBackgroundEngine();
