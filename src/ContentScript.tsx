import { clipboard } from "@extend-chrome/clipboard";

enum Selectors {
  QuestionItem = "div[data-automation-id='questionItem']",
  QuestionList = "#question-list",
  QuestionHeaderParent = "span[data-automation-id='questionTitle']",
  QuestionHeader = "span[role='heading']",
  QuestionContent = "span[class='text-format-content ']",
  QuestionNumber = "span[data-automation-id='questionOrdinal']",
  RadioOption = "div[role='radiogroup']",
  CheckboxOption = "div[role='group']",
}

interface IQuestions {
  question: string;
  options: Array<string>;
  isMultipleChoice: boolean;
  number: number;
}
type QuestionWithOptions = IQuestions[];

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.command === 'start') {

    const QuestionWithOptions: QuestionWithOptions = []

    const QuestionList = document.querySelector(Selectors.QuestionList);
    if (QuestionList) {
      const QuestionItems = QuestionList.querySelectorAll(Selectors.QuestionItem);
      const QuestionItemsAsArray = Array.from(QuestionItems);
      for (let index = 0; index < QuestionItemsAsArray.length; index++) {
        const element = QuestionItemsAsArray[index];


        element.querySelectorAll(Selectors.QuestionHeaderParent).forEach((header) => {
          const qNumber = header.querySelector(Selectors.QuestionNumber)?.textContent?.replace(".", "");
          const title = header.querySelector(Selectors.QuestionContent)?.textContent;
          // try to get if it's a multiple choice question or radio
          const radioOption = element.querySelector(Selectors.RadioOption);
          const checkboxOption = element.querySelector(Selectors.CheckboxOption);

          if (radioOption) {
            const options = radioOption.querySelectorAll("label")
            const optionsArray = Array.from(options).map((option) => option.textContent);
            const IsReady = optionsArray.length > 0 && title && qNumber

            if (!IsReady) return;
            QuestionWithOptions.push({
              question: title,
              options: optionsArray as string[],
              isMultipleChoice: false,
              number: parseInt(qNumber)
            });

          }

          if (checkboxOption) {
            const options = checkboxOption.querySelectorAll("label")
            const optionsArray = Array.from(options).map((option) => option.textContent);
            const IsReady = optionsArray.length > 0 && title && qNumber

            if (!IsReady) return;
            QuestionWithOptions.push({
              question: title,
              options: optionsArray as string[],
              isMultipleChoice: true,
              number: parseInt(qNumber)
            });

          }




        })
      }

      console.log(QuestionWithOptions);



    } else {
      clipboard.writeText("I can't find the question list you're on your own.");
    }
  }

});

