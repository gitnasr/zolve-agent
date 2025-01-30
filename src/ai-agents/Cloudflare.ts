import { CloudflareResponse, Message } from "../types";

import { Agent } from "./abstract";
import { ChromeEngine } from "../chrome";
import { config } from "../../env.prod.json";

// load json file of config (Only for current progress, it will be replaced with chrome storage when implanting the option page)

export class Cloudflare extends Agent {
  host: string;
  private readonly API_BASE = config.cloudflare.API_BASE;
  private readonly ACCOUNT_ID = config.cloudflare.ACCOUNT_ID;
  private readonly MODEL_NAME = config.cloudflare.MODEL_NAME;
  constructor() {
    super();
    this.headers.Authorization = `Bearer ${config.cloudflare.API_KEY}`;
    this.host = `${this.API_BASE}/client/v4/accounts/${this.ACCOUNT_ID}/ai/run/${this.MODEL_NAME}`;
  }

  public async Start(message: Message): Promise<string[]> {
    const CloudflareResponse = await this.SendMessage<CloudflareResponse>(
      message
    );

    const SplittedOutput = CloudflareResponse.result.response
      .split("</think>")[0]
      .split("\n")
      .filter(Boolean)
      .map((str) => str.trim());

    return SplittedOutput;
  }
}
