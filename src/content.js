console.log("Content Script Running")

chrome.runtime.sendMessage({msg: "content-script-loaded"});

// Parse the current page URL for the video ID and returns the ID.
// https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
function getVideoId() {
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


function listenMessages() {
    // Listen for add timestamp request msg from popup
    chrome.runtime.onMessage.addListener((request, sender, response) => {
        if (request.msg === "obtain-timestamp") {
            const timestampData = getCurrentTimestampInfo();
            response(timestampData);
        } else if (request.msg === "change-time") {
            changeTime(request.timestamp);
        } else if (request.msg === "check-content-script-loaded") {
            response({msg: "content-script-loaded"});
        }
    });
}


listenMessages();


// export for unit tests
export const testables = {
    getVideoId, getCurrentTimestampInfo, changeTime, listenMessages
};
