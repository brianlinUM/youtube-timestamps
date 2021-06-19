import queryCurrentTab from "./obtainCurrentTab.js";

// request the current timestamp of active YouTube video tab by messaging
// the tab's content script.
export default function sendObtainTimestampRequest(responseCallback) {
    queryCurrentTab((tabs) => {
        // Needs to be a YouTube video tab.
        // Length will be zero if not matching URL.
        if (tabs.length > 0) {
            chrome.tabs.sendMessage(
                tabs[0].id, {msg: "obtain-timestamp"},
                responseCallback
            );
        }
        // URL matcher for YouTube video pages
    }, "https://www.youtube.com/watch?v=*");
}
