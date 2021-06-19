import {setVideoTimestamp} from "./common/chromeStorageAPI.js";
import sendObtainTimestampRequest from "./common/obtainTimestamp.js";

console.log("Background Script Running");

// Message to popup to add timestamp.
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
                    // we call to persistent storage here since popup may not be open
                    // and thus not have vuex initialized.
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
