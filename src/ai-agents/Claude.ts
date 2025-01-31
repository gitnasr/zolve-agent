import { ClaudeLocalStorage, ClaudeServerResponse, Message } from "../types";

import { Agent } from "./abstract";
import { ChromeEngine } from "../chrome";
import { SystemPrompt } from "./Prompt";
import { config } from "../../env.prod.json";

export class ClaudeReversed extends Agent {
  private static instance: ClaudeReversed;
  protected readonly host: string = config.claude.host;
  private readonly conversationIdKey: string =
    "ClaudeReversedConversationIdWithForm";
  private formId: string;
  public conversationId: string | null = null;

  static async getInstance(formId: string) {
    if (!this.instance) {
      this.instance = new ClaudeReversed(formId);
      const cookies = await ChromeEngine.getCookiesByDomain("claude.ai");
      this.instance.headers.Cookies = cookies;
      console.log("🚀 ~ ClaudeReversed ~ getInstance ~ this.instance.headers:", this.instance.headers)
      await this.instance.PrepareConversation();
    }

    return this.instance;
  }
  private constructor(formId: string) {
    super();
    this.formId = formId;
  }

  public async Start(message: Message) {
    const json = await this.SendMessage<ClaudeServerResponse>(
      message,
      this.conversationId,
      "/claude",
      {
        conversationId: this.conversationId,
      }
    );

    if (json.response == "Too many requests") {
      ChromeEngine.sendNotification(
        "Failed",
        "Claude is limited, try again later"
      );
      return [];
    }
    const SplittedOutput = json.response
      .split("\n")
      .filter(Boolean)
      .map((str) => str.trim());

    return SplittedOutput;
  }
  private async StartConversation(): Promise<string> {
    const payload = {
      message: SystemPrompt,
    };
    const Response = await fetch(`${this.host}/claude/new_chat`, {
      body: JSON.stringify(payload),
      headers: this.headers,
      method: "POST",
    });
    if (Response.status == 200) {
      const json = await Response.json();
      return json.conversationId;
    } else {
      throw new Error("Failed to start conversation");
    }
  }

  private async PrepareConversation() {
    const conversationIdWithForm =
      await ChromeEngine.getLocalStorage<ClaudeLocalStorage>(
        this.conversationIdKey
      );
  
    if (conversationIdWithForm) {
      console.table(conversationIdWithForm);
      this.conversationId = conversationIdWithForm.conversationId;
  
      let formId = conversationIdWithForm.formId;
  
      if (formId !== this.formId) {
        this.conversationId = await this.StartConversation();
        await ChromeEngine.setLocalStorage<ClaudeLocalStorage>(
          this.conversationIdKey,
          {
            conversationId: this.conversationId,
            formId: this.formId,
          }
        );
      }
    } else {
      console.log("No conversation found, starting a new one");
  
      this.conversationId = await this.StartConversation();
      await ChromeEngine.setLocalStorage<ClaudeLocalStorage>(
        this.conversationIdKey,
        {
          conversationId: this.conversationId,
          formId: this.formId,
        }
      );
    }
  
    // هنا لو لسه ما حصلتش على الـ conversationId، ممكن تضيف انتظار (async/await)
    if (!this.conversationId) {
      throw new Error("Failed to initialize conversation ID");
    }
  }
  


}
