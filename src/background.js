import {updateLocalStorage} from "./updateStorage.js";

console.log("Background Script Running");

// send a message to popup instance to update its videos data
function sendUpdatePopupInstance(timestampData) {
    chrome.runtime.sendMessage(
        {msg: "update-timestamp", timestampData: timestampData}
    );
}

// send an add timestamp request to content script
function sendTimestampRequest() {
    chrome.tabs.query(
        {
            active: true, currentWindow: true,
            url: "https://www.youtube.com/watch?v=*",
        }, (tabs) => {
            // needs to be a YouTube video tab
            if (tabs.length > 0) {
                chrome.tabs.sendMessage(
                    tabs[0].id, {msg: "obtain-timestamp"}, (response) => {
                        updateLocalStorage(response);
                        sendUpdatePopupInstance(response);
                    }
                );
            }
        }
    );
}


// listen for hotkey to add timestamp
chrome.commands.onCommand.addListener((command) => {
    if (command === "add-timestamp") {
        sendTimestampRequest();
    }
});
