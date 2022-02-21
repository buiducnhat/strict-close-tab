import 'reflect-metadata';
import { Service } from 'typedi';

import { CloseTab } from 'src/models/close-tab.interface';

@Service()
export class CloseTabService {
  public async getCloseTabs(): Promise<CloseTab[]> {
    try {
      const result = await chrome.storage.local.get('closeTabs');
      return result.closeTabs || [];
    } catch (error) {
      return [];
    }
  }

  public async getCloseTab(name: string) {
    try {
      const closeTabs = await this.getCloseTabs();
      return closeTabs.find((closeTab) => closeTab.name === name) || null;
    } catch (error) {
      return null;
    }
  }

  public async getCloseTabByUrl(url: string): Promise<CloseTab | null> {
    try {
      const closeTabs = await this.getCloseTabs();
      return closeTabs.find((closeTab) => url.includes(closeTab.url)) || null;
    } catch (error) {
      return null;
    }
  }

  public async createCloseTab(closeTabInput: CloseTab): Promise<CloseTab | null> {
    try {
      const closeTabs = await this.getCloseTabs();
      if (closeTabs.some((closeTab) => closeTab.name === closeTabInput.name)) {
        return null;
      }
      closeTabs.push(closeTabInput);
      await chrome.storage.local.set({ closeTabs });
      return closeTabInput;
    } catch (error) {
      return null;
    }
  }

  public async updateCloseTab(closeTabInput: CloseTab): Promise<CloseTab | null> {
    try {
      let closeTabs = await this.getCloseTabs();
      const closeTab = closeTabs.find((closeTab) => closeTab.name === closeTabInput.name);
      if (!closeTab) {
        return null;
      }

      closeTabs = closeTabs.map((closeTab) => {
        if (closeTab.name === closeTabInput.name) {
          return closeTabInput;
        }
        return closeTab;
      });
      await chrome.storage.local.set({ closeTabs });
      return closeTabInput;
    } catch (error) {
      return null;
    }
  }

  public async deleteCloseTab(name: string): Promise<boolean> {
    try {
      let closeTabs = await this.getCloseTabs();
      const closeTab = closeTabs.find((closeTab) => closeTab.name === name);
      if (!closeTab) {
        return false;
      }

      closeTabs = closeTabs.filter((closeTab) => closeTab.name !== name);
      await chrome.storage.local.set({ closeTabs });
      return true;
    } catch (error) {
      return false;
    }
  }

  // public async decreaseRemainTime(name: string): Promise<CloseTab | null> {
  //   try {
  //     const closeTab = await this.getCloseTab(name);
  //     if (!closeTab) {
  //       return null;
  //     }
  //     if (closeTab?.remainTime === undefined) {
  //       closeTab!.remainTime = closeTab?.duration;
  //     } else {
  //       closeTab.remainTime -= 1;
  //     }
  //     return this.updateCloseTab(closeTab as CloseTab);
  //   } catch (error) {
  //     return null;
  //   }
  // }
}
