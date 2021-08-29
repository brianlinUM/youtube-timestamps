import {sendMessageOnVideo} from "./obtainCurrentTab.js";

// request the current timestamp of active YouTube video tab by messaging
// the tab's content script.
export default function sendObtainTimestampRequest(responseCallback) {
    sendMessageOnVideo({msg: "obtain-timestamp"}, responseCallback);
}
