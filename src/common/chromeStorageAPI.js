// We use Chrome local storage for persistance of data.
// Chrome local Storage is organized as:
// {videoId: {title, timestamps:{timestamp: label}}}
// Each videoId corresponds to a videoMeta.
// This format enforces that each timestamp for a given video is unique.

// set/get: data may or may not exist already
// update: data must exist already

// obtain video with corresponding videoId and execute callback with video metadata.
function getVideo(videoId, getCallback) {
    chrome.storage.local.get(videoId, (data) => {
        getCallback(data);
    })
}

// Change the meta data for a video.
function setVideo(videoId, videoMeta, setCallback=null) {
    chrome.storage.local.set(
        {
            [videoId]: videoMeta
        }, () => {
            if (setCallback !== null) {
                setCallback(); // for debugging
            }
        }
    );
}

// Add new timestamp for a video into local storage.
// it is possible that label is not provided e.g. add by hotkey
export function setVideoTimestamp({videoId, title, timestamp, label=""}, setCallback=null) {
    getVideo(videoId, (data) => {
        let videoMeta = {title, timestamps: {}};
        // find out if we need to add to existing data for given videoId
        if (videoId in data) {
            videoMeta = data[videoId];
        }
        videoMeta.timestamps[timestamp] = label;
        setVideo(videoId, videoMeta, setCallback);
    });
}

export function updateVideoTitle({videoId, title: newTitle}, setCallback=null) {
    getVideo(videoId, ({[videoId]: videoMeta}) => {
        videoMeta.title = newTitle;
        setVideo(videoId, videoMeta, setCallback);
    });
}

export function updateTimestampLabel({videoId, timestamp, label}, setCallback=null) {
    getVideo(videoId, ({[videoId]: videoMeta}) => {
        videoMeta.timestamps[timestamp] = label;
        setVideo(videoId, videoMeta, setCallback);
    });
}

export function removeVideoTimestamp({videoId, timestamp}, setCallback=null) {
    getVideo(videoId, ({[videoId]: videoMeta}) => {
        delete videoMeta.timestamps[timestamp];
        setVideo(videoId, videoMeta, setCallback);
    });
}

export function removeVideo(videoId) {
    chrome.storage.local.remove(videoId);
}

export function removeAllData() {
    chrome.storage.local.clear();
}

export function getAllData(getCallback) {
    chrome.storage.local.get(null, getCallback);
}

// Print all data in chrome local storage. For debugging.
export function printAllData() {
    getAllData((data) => {console.log(data);});
}
