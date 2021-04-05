import queryCurrentTab from "./obtainCurrentTab.js";

// send an obtain timestamp request to content script
export default function sendObtainTimestampRequest(responseCallback) {
    queryCurrentTab((tabs) => {
        // needs to be a YouTube video tab
        if (tabs.length > 0) {
            chrome.tabs.sendMessage(
                tabs[0].id, {msg: "obtain-timestamp"},
                responseCallback
            );
        }
    }, "https://www.youtube.com/watch?v=*");
}
