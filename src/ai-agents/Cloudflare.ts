import { CloudflareResponse, Message } from "../types";

import { Agent } from "./abstract";
import { ChromeEngine } from "../chrome";
import { config } from "../../env.prod.json";

// load json file of config (Only for current progress, it will be replaced with chrome storage when implanting the option page)
interface CloudflareConfig {
  apiEndpoint: string;
  accountId: string;
  modelName: string;
  apiKey: string;
}
export class Cloudflare extends Agent {
  protected host: string = "";

  protected readonly ConfigId: string = "CloudflareConfig";

  constructor() {
    super();
  }

  public async Start(message: Message): Promise<string[]> {
    await this.prepareHost();
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

  protected async prepareHost(): Promise<void> {
    const Config = await this.getConfigByKey<CloudflareConfig>(this.ConfigId);
    if (!Config) {
      throw new Error("Cloudflare Config not found");
    }
    this.host = `${Config.apiEndpoint}/client/v4/accounts/${Config.accountId}/ai/run/${Config.modelName}`;
    this.headers.Authorization = `Bearer ${Config.apiKey}`;
  }
}
