import {sendMessageOnVideo} from "./obtainCurrentTab.js";

// request the current timestamp of active YouTube video tab by messaging
// the tab's content script.
export function sendObtainTimestampRequest(responseCallback) {
    sendMessageOnVideo({msg: "obtain-timestamp"}, responseCallback);
}

// converts from seconds to HH:MM:SS
// https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
export function convertTimeFormat(seconds) {
    let dateObj = new Date(0);
    dateObj.setSeconds(seconds);
    return dateObj.toISOString().substr(11, 8);
}
