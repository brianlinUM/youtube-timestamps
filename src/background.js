import {updateLocalStorage} from "./common/updateStorage.js";
import sendObtainTimestampRequest from "./common/obtainTimestamp.js";

console.log("Background Script Running");

// send a message to popup instance to update its videos data
function sendUpdatePopupInstance(timestampData) {
    chrome.runtime.sendMessage(
        {msg: "update-timestamp", timestampData: timestampData}
    );
}

// listen for hotkey to add timestamp
chrome.commands.onCommand.addListener((command) => {
    if (command === "add-timestamp") {
        sendObtainTimestampRequest((response) => {
            updateLocalStorage(response);
            sendUpdatePopupInstance(response);
        });
    }
});
