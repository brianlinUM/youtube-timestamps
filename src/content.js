// Content script runs after matching page (specified in manifest.json) loads.
// For functions that need access to webpage DOM.
console.log("Content Script Running")

import {convertTimeFormat} from "./common/obtainTimestamp.js";

chrome.runtime.sendMessage({msg: "content-script-loaded"});

// Parse the current page URL for the video ID and returns the ID.
// https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
function getVideoId() {
    if (window.location.search.split('v=')[1] === undefined) {
        return "";
    }
    let videoId = window.location.search.split('v=')[1];
    let ampersandPosition = videoId.indexOf('&');
    // filter out irrevelant query part
    if (ampersandPosition != -1) {
        videoId = videoId.substring(0, ampersandPosition);
    }
    return videoId;
}

// Obtain all relevant info for the timestamp and returns it.
function getCurrentTimestampInfo() {
    const time = document.getElementsByTagName("video")[0].currentTime;
    const videoId = getVideoId();
    // obtain title by scraping webpage
    const title = document.getElementsByClassName(
        "title style-scope ytd-video-primary-info-renderer"
    )[0].firstChild.innerText;

    return {
        timestamp: Math.floor(time),
        videoId,
        title,
    }
}


// Change video's current time
function changeTime (newTime) {
    let video = document.getElementsByTagName("video")[0]
    video.currentTime = newTime;
}

// Inject a notification to the page DOM, indicating to user
// that a new timestamp has been successfully added.
// Useful for when user is only adding timestamp via the hotkey
// and without the popup open.
function pushSuccessNotification(timestamp) {
    // Remove existing timestamps first
    const successPopupHandle = document.getElementById("YT_Timestamps_success_popup");
    if (successPopupHandle != null) {
        successPopupHandle.remove();
    }

    const div = document.createElement("div");
    div.id = "YT_Timestamps_success_popup";

    div.style.position = "fixed";
    div.style.display = "flex";
    div.style.justifyContent = "center";
    div.style.alignItems = "center";

    div.style.top = "75px";
    div.style.left = "15%";
    div.style.width = "33%";
    div.style.height = "25px";

    div.style.background = "#2171FF";
    div.style.border = "2px solid #FFAF21"
    div.style.color = "#FFAF21";
    div.style.fontSize = "15px";
    div.style.borderRadius = "5px"

    div.innerHTML = "Added new timestamp: " + convertTimeFormat(timestamp);
    document.body.appendChild(div);
    const fadeHandle = setTimeout(() => {
        div.remove();
        clearTimeout(fadeHandle);
    }, 2000);
}


function listenMessages() {
    // Listen for add timestamp request msg from popup
    chrome.runtime.onMessage.addListener((request, sender, response) => {
        if (request.msg === "obtain-timestamp") {
            const timestampData = getCurrentTimestampInfo();
            response(timestampData);
            pushSuccessNotification(timestampData.timestamp);
        } else if (request.msg === "change-time") {
            changeTime(request.timestamp);
        } else if (request.msg === "check-content-script-loaded") {
            response({msg: "content-script-loaded"});
            const videoId = getVideoId();
            chrome.runtime.sendMessage({msg: "update-current-videoId", videoId});
        }
    });
}

const videoId = getVideoId();
chrome.runtime.sendMessage({msg: "update-current-videoId", videoId});
listenMessages();


// export for unit tests
export const testables = {
    getVideoId, getCurrentTimestampInfo, changeTime, listenMessages
};
