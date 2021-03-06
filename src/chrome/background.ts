import Container from 'typedi';
import { secondsToMilliseconds } from 'date-fns';

import { CloseTabService } from 'src/services/close-tab.service';
import { TabRemainTimeService } from 'src/services/tab-remain-time.service';
import { TimeOutFnService } from 'src/services/time-out-fn.service';

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

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (tab.status !== 'complete') {
    return;
  }

  const closeTabService = Container.get(CloseTabService);
  const tabRemainTimeService = Container.get(TabRemainTimeService);
  const timeOutFnService = Container.get(TimeOutFnService);

  const tabRemainTime = await tabRemainTimeService.getOne({ tabId, windowId: tab.windowId });
  const closeTab = await closeTabService.getCloseTabByUrl(tab.url as string);

  // Case has !! or ! (closeTab+tabRemainTime)
  if ((closeTab && tabRemainTime) || (!closeTab && !tabRemainTime)) {
    return;
  }
  // Case has closeTab defined but not tabRemainTime
  // => need to create new tabRemainTime for process
  if (closeTab && !tabRemainTime) {
    await tabRemainTimeService.add({
      name: closeTab.name,
      duration: closeTab.duration,
      startTime: new Date().getTime(),
      tabId,
      windowId: tab.windowId,
    });
    // Set timeout notify 30s before closing tab
    const beforeExpiredTimeOut = setTimeout(async () => {
      chrome.tabs.sendMessage(tabId, { message: 'before expired' });
      chrome.notifications.create({
        title: 'Before expired',
        message: '30s count down before your tab is blocked',
        type: 'basic',
        iconUrl: './../../logo.png',
      });
      await timeOutFnService.delete(`beforeExpiredTimeOut-${tabId}-${tab.windowId}`);
    }, secondsToMilliseconds(closeTab.duration - 30));

    const expiredTimeOut = setTimeout(async () => {
      chrome.tabs.sendMessage(tabId, { message: 'expired' });
      await tabRemainTimeService.delete({ tabId, windowId: tab.windowId });
      await timeOutFnService.delete(`expiredTimeOut-${tabId}-${tab.windowId}`);
    }, secondsToMilliseconds(closeTab.duration));

    await timeOutFnService.add({
      key: `beforeExpiredTimeOut-${tabId}-${tab.windowId}`,
      value: beforeExpiredTimeOut,
    });
    await timeOutFnService.add({
      key: `expiredTimeOut-${tabId}-${tab.windowId}`,
      value: expiredTimeOut,
    });
  }
  // Case !clostTab but tabRemainTime
  // => The url of the tab was updated => delete timeOuts
  else {
    await tabRemainTimeService.delete({ tabId, windowId: tab.windowId });

    await timeOutFnService.delete(`beforeExpiredTimeOut-${tabId}-${tab.windowId}`);
    await timeOutFnService.delete(`expiredTimeOut-${tabId}-${tab.windowId}`);
  }
});

chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
  const tabRemainTimeService = Container.get(TabRemainTimeService);
  await tabRemainTimeService.delete({ tabId, windowId: removeInfo.windowId });

  const timeOutFnService = Container.get(TimeOutFnService);
  await timeOutFnService.delete(`beforeExpiredTimeOut-${tabId}-${removeInfo.windowId}`);
  await timeOutFnService.delete(`expiredTimeOut-${tabId}-${removeInfo.windowId}`);
});
