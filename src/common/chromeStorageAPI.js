// We use Chrome local storage for persistance of data.
// Chrome local Storage is organized as:
// {videoId: {title, timestamps:[timestamp,...]}}

// Change the meta data for a single video, using its current value.
export function updateSingleVideo(videoId, getCallback, setCallback=null) { 
    chrome.storage.local.get(videoId, (data) => {
        const updatedVideoMeta = getCallback(data);
        chrome.storage.local.set(
            {
                [videoId]: updatedVideoMeta
            }, () => {
                if (setCallback !== null) {
                    setCallback(); // for debugging
                }
            }
        );
    });
}

// Add new timestamp for a video into local storage.
export function addTimestampToStorage(timestampData, setCallback=null) {
    const {videoId, title, timestamp} = timestampData;
    updateSingleVideo(
        videoId, 
        // get timestamps for given videoId then update it
        (data) => {
            // data format: {videoId: {title, timestamps:[timestamp,...]}}
            let videoMeta = {title: title, timestamps: []};
            // find out if we need to append to existing data for given videoId
            if (videoId in data) {
                videoMeta = data[videoId];
            }
            videoMeta.timestamps.push(timestamp);
            return videoMeta;
        },
        // simply pass on
        setCallback
    );
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
