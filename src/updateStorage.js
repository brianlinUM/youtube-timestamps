// update local Chrome storage with new timestamp
// Chrome local storage is the single source of truth for timestamps.
// Storage is organized as:
// {videoId: {title, timestamps:[timestamp,...]}}
function updateLocalStorage(timestampData, callback=null) {
    const {videoId, title, timestamp} = timestampData;
    // get timestamps for given videoId then update it
    chrome.storage.local.get(videoId, (data) => {
        // data format: {videoId: {title, timestamps:[timestamp,...]}}
        let videoMeta = {title: title, timestamps: []};
        // find out if we need to append to existing data for given videoId
        if (videoId in data) {
            videoMeta = data[videoId];
        }
        videoMeta.timestamps.push(timestamp);

        chrome.storage.local.set(
            {
                [videoId]: videoMeta,
            }, () => {
                if (callback !== null) {
                    callback(); // for debugging
                }
            }
        );
    });
}

// Print all data in chrome local storage. For debugging.
function getAllData() {
    chrome.storage.local.get(null, (data) => {
        console.log(data);
    })
}

export {updateLocalStorage, getAllData};