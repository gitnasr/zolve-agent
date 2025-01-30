import { Agent } from "./abstract";
import { ChromeEngine } from "../chrome";
import { Message } from "../types";
import { SystemPrompt } from "./Prompt";
import { config } from "../../env.prod.json";

export class ClaudeReversed extends Agent {
  private static instance: ClaudeReversed;
  protected readonly host: string = config.claude.host;
  private readonly conversationIdKey: string = "ClaudeReversedConversationId";
  public conversationId: string | null = null;

  static async getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new ClaudeReversed();
    await this.instance.PrepareConversation();
    return this.instance;
  }
  private constructor() {
    super();
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
    console.log("PrepareConversation");

    let conversationId = await ChromeEngine.getLocalStorage(
      this.conversationIdKey
    );
    if (conversationId) {
      this.conversationId = conversationId;
    } else {
      this.conversationId = await this.StartConversation();
      await ChromeEngine.setLocalStorage(
        this.conversationIdKey,
        this.conversationId
      );
    }
  }
}
