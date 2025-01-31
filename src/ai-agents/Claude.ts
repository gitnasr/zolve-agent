import { Agent } from "./abstract";
import { ChromeEngine } from "../chrome";
import { Message } from "../types";
import { SystemPrompt } from "./Prompt";
import { config } from "../../env.prod.json";

interface ClaudeLocalStorage {
  conversationId: string;
  formId: string;
}
export class ClaudeReversed extends Agent {
  private static instance: ClaudeReversed;
  protected readonly host: string = config.claude.host;
  private readonly conversationIdKey: string =
    "ClaudeReversedConversationIdWithForm";
  private formId: string;
  public conversationId: string | null = null;

  static async getInstance(formId: string) {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new ClaudeReversed(formId);
    await this.instance.PrepareConversation();
    return this.instance;
  }
  private constructor(formId: string) {
    super();
    this.formId = formId;
  }

  public async Start(message: Message) {
    const response = await this.SendMessage<string>(
      message,
      this.conversationId,
      "/claude",
      {
        conversationId: this.conversationId,
      }
    );
    if (response === "Too many requests") {
      ChromeEngine.sendNotification(
        "Failed",
        "Claude is limited, try again later"
      );
      return [];
    }
    const SplittedOutput = response
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
    //Every form should be connected to a conversation

    const conversationIdWithForm =
      await ChromeEngine.getLocalStorage<ClaudeLocalStorage>(
        this.conversationIdKey
      );
      console.log("🚀 ~ ClaudeReversed ~ PrepareConversation ~ conversationIdWithForm:", conversationIdWithForm)

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
  }
}
