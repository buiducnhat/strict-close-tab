import 'reflect-metadata';
import { Service } from 'typedi';

import { TabRemainTime } from 'src/models/close-tab.interface';

@Service()
export class TabRemainTimeService {
  public async getAll(): Promise<TabRemainTime[]> {
    const tabRemainTimesResult = await chrome.storage.local.get('tabRemainTimes');
    return (tabRemainTimesResult.tabRemainTimes as TabRemainTime[]) || [];
  }

  public async getOne({ tabId, windowId }: { tabId: number; windowId: number }) {
    const tabRemainTimes = await this.getAll();
    return tabRemainTimes.find(
      (tabRemainTime) => tabRemainTime.tabId === tabId && tabRemainTime.windowId === windowId
    );
  }

  public async save(tabRemainTimes: TabRemainTime[]): Promise<TabRemainTime[]> {
    await chrome.storage.local.set({ tabRemainTimes });
    return tabRemainTimes;
  }

  public async add(tabRemainTimeInput: TabRemainTime): Promise<TabRemainTime | null> {
    const tabRemainTimes = await this.getAll();
    if (
      tabRemainTimes.some(
        (tabRemainTime) =>
          tabRemainTimeInput.tabId === tabRemainTime.tabId &&
          tabRemainTimeInput.windowId === tabRemainTime.windowId
      )
    ) {
      return null;
    }
    tabRemainTimes.push(tabRemainTimeInput);
    await this.save(tabRemainTimes);
    return tabRemainTimeInput;
  }

  public async delete({ tabId, windowId }: { tabId: number; windowId: number }) {
    let tabRemainTimes = await this.getAll();
    tabRemainTimes = tabRemainTimes.filter(
      (tabRemainTime) => !(tabRemainTime.tabId === tabId && tabRemainTime.windowId === windowId)
    );
    await this.save(tabRemainTimes);
  }
}
