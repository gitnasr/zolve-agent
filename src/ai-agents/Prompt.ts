import { IPrompt } from "../types";

export const Prompt = (
  messages: string[],
  systemPrompt: string | null = null
) => {
  const PromptToSend: IPrompt = {
    messages: [],
  };

  if (systemPrompt) {
    PromptToSend.messages.push({
      role: "system",
      content: systemPrompt,
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
