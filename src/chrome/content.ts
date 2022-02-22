export {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.message) {
    case 'before expired':
      sendBeforeExpiredNoti();
      break;
    case 'expired':
      replaceBodyWithEmpty();
      break;
  }
});

const sendBeforeExpiredNoti = () => {
  console.log('before expired');
};

const replaceBodyWithEmpty = () => {
  console.log('expired');
  const body = document.body;
  const warningNodeString =
    `<div ` +
    `style=` +
    `"display:flex;` +
    `position: fixed;` +
    `border-radius: 8px;` +
    `top: 2.5%;` +
    `left: 2.5%;` +
    `background-color: #cc0000;` +
    `justify-content:center;` +
    `align-items:center;` +
    `width:95%;` +
    `height:95vh;` +
    `color:#fff;` +
    `font-size:4em;` +
    `font-weight:bold;"` +
    `>` +
    `⚠️Your time is up, focus on work!⚠️` +
    `</div>`;
  const warningNode = new DOMParser().parseFromString(warningNodeString, 'text/html').body
    .childNodes[0];
  body.appendChild(warningNode);
};
