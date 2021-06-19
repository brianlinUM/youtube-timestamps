import {setVideoTimestamp} from "./common/chromeStorageAPI.js";
import sendObtainTimestampRequest from "./common/obtainTimestamp.js";

console.log("Background Script Running");

// send a message to popup instance to update its videos data
function sendUpdatePopupInstance(timestampData) {
    chrome.runtime.sendMessage(
        {msg: "update-timestamp", timestampData}
    );
}

function listenHotkeys() {
    // listen for hotkey to add timestamp
    chrome.commands.onCommand.addListener((command) => {
        if (command === "add-timestamp") {
            sendObtainTimestampRequest((response) => {
                if (chrome.runtime.lastError || !response) {}
                else {
                    // we call storage here instead of in popup since popup may not be open
                    setVideoTimestamp(response);
                    sendUpdatePopupInstance(response);
                }
            });
        }
    });
}

listenHotkeys();

export const testables = {
    sendUpdatePopupInstance, listenHotkeys
};
