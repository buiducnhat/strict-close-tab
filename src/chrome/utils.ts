export const getCurrentTab = async () => {
  if (!chrome.tabs) {
    return null;
  }
  const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  return tabs[0];
};

export const getAllTabs = async () => {
  if (!chrome.tabs) {
    return [];
  }
  const tabs = await chrome.tabs.query({});
  return tabs;
};
