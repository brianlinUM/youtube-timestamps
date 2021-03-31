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
    const title = document.getElementsByClassName(
        "title style-scope ytd-video-primary-info-renderer"
    )[0].firstChild.innerText;

    return {
        timestamp: Math.floor(time),
        videoId: videoId,
        title: title,
    }
}


// Listen for add timestamp request msg from popup
chrome.runtime.onMessage.addListener((request, sender, response) => {
    if (request.msg === "add-timestamp") {
        const timestampData = getCurrentTimestampInfo();
        response(timestampData);
    }
});
