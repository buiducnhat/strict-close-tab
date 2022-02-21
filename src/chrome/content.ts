export {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.message === 'expired') {
    alert('Expired');
  }
});
