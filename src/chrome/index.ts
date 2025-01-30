import { Actions } from "./actions";
import { clipboard } from "@extend-chrome/clipboard";

export class ChromeEngine {
  private constructor() {
  }
  static sendNotification(title: string, message: string) {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon.png",
      title,
      message,
    });
  }
  static getCookiesByDomain(domain: string): Promise<string> {
    return new Promise((resolve, reject) => {
      chrome.cookies.getAll({ domain }, (cookies) => {
        resolve(cookies.join(";"));
      });
    });
  }
  static getLocalStorage(key: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(key, (result) => {
        if (result[key]) resolve(result[key]);
        else resolve(null);
      });
    });
  }
  static setLocalStorage(key: string, value: string): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set({ [key]: value }, () => {
        resolve();
      });
    });
  }

  static async clearStorage() {
    chrome.storage.sync.clear();
  }
  static async getTabIdByURL(url: string): Promise<number | null> {
    return new Promise((resolve, reject) => {
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        (tabs) => {
          const tab = tabs.find((tab) => tab.url?.includes(url));
          if (tab && tab.id) resolve(tab.id);
          else resolve(null);
        }
      );
    });
  }
  static async Sleep(milliseconds: number) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }
}
