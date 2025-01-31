import { Actions } from "./chrome/actions";
import { ChromeEngine } from "./chrome";
import { ChromeMessage } from "./types";
import { MicrosoftFormsScrapper } from "./engines/microsoft/forms";

class ContentScript {
  constructor() {
    this.registerListeners();
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
            console.log("🚀 ~ ContentScript ~ No questions found");
          }
        }
        if (command === Actions.setResponseIntoTextbox) {
          const textBox =  this.renderTextbox();
          textBox.innerHTML += data;
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

  private  renderTextbox() {
    const textbox = document.querySelector(".es-output");
    if (!textbox) {
      // Create one
      const textbox = document.createElement("textarea");
      textbox.classList.add("es-output");
      textbox.style.position = "fixed";
      textbox.style.bottom = "0";
      textbox.style.right = "0";
      textbox.style.width = "50%";
      document.body.appendChild(textbox);
      return textbox;
    }

    return textbox;

  }
}

new ContentScript();
