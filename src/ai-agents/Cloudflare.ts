import { CloudflareConfig, CloudflareResponse, Message } from "../types";

import { Agent } from "./abstract";

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
    await this.getGlobalPrompt();
  }
}
