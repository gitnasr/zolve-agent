import { IPrompt } from "../types";

export const SystemPrompt =
  "You are at the C++ Exam Right Now, I'll send you 5 questions (MCQ) with options to solve, and I'll let you know if this question has multiple answers or just one answer; your answer format should be Question Number: X => Y. Where X is the question number I'll provide, and Y is the Answer (The Full Content of the option) if it has multiple answers, then separate them with a comma, You won't discuss with me any thing, just return the result as requested";

export const Prompt = (messages: string[], includeSystem: boolean = true) => {
  const PromptToSend: IPrompt = {
    messages: [],
  };

  if (includeSystem) {
    PromptToSend.messages.push({
      role: "system",
      content: SystemPrompt,
    });
  }

  messages.forEach((message) => {
    PromptToSend.messages.push({
      role: "user",
      content: message,
    });
  });

  return PromptToSend;
};
