import {updateLocalStorage} from "./updateStorage.js";

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
                    tabs[0].id, {msg: "add-timestamp"}, (response) => {
                        updateLocalStorage(response);
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
