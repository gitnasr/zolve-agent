import "../public/index.css";

import { Actions } from "./chrome/actions";
import { ChromeEngine } from "./chrome";
import { ChromeMessage } from "./types";
import { MicrosoftFormsScrapper } from "./engines/microsoft/forms";

class ContentScript {
  constructor() {
    this.registerListeners();
    const textBox =  this.renderTextbox();
  }

  private registerListeners() {
    chrome.runtime.onMessage.addListener(
      async (msg: ChromeMessage, _sender, _sendResponse) => {
        const { command, data } = msg;

        if (command === Actions.start && data.service == "forms.office.com") {
          const MSFS = new MicrosoftFormsScrapper();
          const ArrayOf5Formatted = await MSFS.Scrape();
          if (ArrayOf5Formatted) {
            this.SendChunksToAgent(
              ArrayOf5Formatted,
              data.agent,
              data.service,
              MSFS.formId
            );
          } else {
            ChromeEngine.sendNotification("Error While Scraping", "No Data Sent back from the scraper");
          }
        }
        if (command === Actions.setResponseIntoTextbox) {
          const textBox =  this.renderTextbox();
          textBox.innerHTML += "\n" +data;
        }
      }
    );
  }
  private SendChunksToAgent(
    ArrayOfArrayOfQuestions: string[][],
    agent: keyof typeof Actions,
    service: string,
    formId: string
  ) {
    for (let index = 0; index < ArrayOfArrayOfQuestions.length; index++) {
      const element = ArrayOfArrayOfQuestions[index];
      const Message = element.join("\n");
      chrome.runtime.sendMessage({
        command: Actions[agent],
        data: {
          service,
          message: Message,
          agent,
          formId,
        },
      });
    }
  }

  private renderTextbox() {
    const parent = document.querySelector(".es-output-parent");
    
    if (!parent) {
      
      const textbox = document.createElement("textarea");
      textbox.classList.add("es-output-text-area");
      const parent = document.createElement("div");
      parent.classList.add("es-output-parent");
      parent.appendChild(textbox);
      document.body.appendChild(parent);
      return textbox;
    }
    const textbox = parent.querySelector(".es-output-text-area")!;

    return textbox;

  }
}

new ContentScript();
