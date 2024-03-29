// Obtains the chrome tab object for the current tab and execute callback with it.
// If url supplied, then tab object will only be passed on to callback if it matches
// the url.
export function queryCurrentTab(queryCallback, url = null) {
  const matchConditions = { active: true, currentWindow: true };
  if (url !== null) {
    matchConditions.url = url;
  }

  chrome.tabs.query(matchConditions, queryCallback);
}

export function sendMessageOnVideo(message, responseCallback = null) {
  queryCurrentTab((tabs) => {
    // Needs to be a YouTube video tab.
    // Length will be zero if not matching URL.
    if (tabs.length > 0) {
      chrome.tabs.sendMessage(tabs[0].id, message, responseCallback);
    }
    // URL matcher for YouTube video pages
  }, 'https://www.youtube.com/watch?v=*');
}
