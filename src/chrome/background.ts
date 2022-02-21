import Container from 'typedi';

import { CloseTabService } from 'src/services/close-tab.service';
import { TabRemainTime } from 'src/models/close-tab.interface';
import { secondsToMilliseconds } from 'date-fns';

export {};

chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('[background] onInstalled', details);
});

chrome.runtime.onConnect.addListener((port) => {
  console.log('[background] onConnect', port);
});

chrome.runtime.onStartup.addListener(() => {
  console.log('[background] onStartup');
});

chrome.runtime.onSuspend.addListener(() => {
  console.log('[background] onSuspend');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log({ message, sender });
});

chrome.tabs.onCreated.addListener(async (tabBefore) => {
  let hasUrl = false;
  const closeTabService = Container.get(CloseTabService);

  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    // Need only the url for config below, so check if tab parameter has property url
    if (hasUrl) {
      return;
    }
    hasUrl = !!tab.url;

    if (tabBefore.id === tabId) {
      const tabRemainTimesResult = await chrome.storage.local.get('tabRemainTimes');
      const tabRemainTimes = (tabRemainTimesResult.tabRemainTimes as TabRemainTime[]) || [];
      console.log({ tabRemainTimes });

      const closeTab = await closeTabService.getCloseTabByUrl(tab.url as string);
      console.log({ closeTab });
      if (!closeTab) {
        return;
      }
      if (tabRemainTimes.some((tabRemainTime) => tabRemainTime.tabId === tabId)) {
        return;
      }

      tabRemainTimes.push({
        tabId: tabId,
        name: closeTab.name,
        startTime: new Date(),
        duration: closeTab.duration,
      });
      await chrome.storage.local.set({ tabRemainTimes });
      setTimeout(async () => {
        chrome.tabs.sendMessage(tabId, { message: 'expired' });
      }, secondsToMilliseconds(closeTab.duration));
    }
  });
});
