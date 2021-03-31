<template>
    <div id="popup">
        <button 
            type="button" id="add-timestamp-btn" v-show="isYoutubeVideoTab" 
            @click="sendTimestampRequest"
        >
                Add Timestamp
        </button>
        <button
            type="button" id="remove-all-btn"
            @click="clearAllTimestamps"
        >
            Clear All Timestamps
        </button>
        <VideoList :videosProp="videos" 
            @remove-timestamp="removeTimestamp"
            @remove-video="removeVideo"
        />
    </div>
</template>


<script>
import VideoList from "./VideoList.vue";
// Chrome local storage is the single source of truth for timestamps.
// Storage is organized as:
// {videoId: {title, timestamps:[timestamp,...]}}
export default {
    components: {VideoList},
    data () {
        return {
            videos: {},
            isYoutubeVideoTab: false,
        }
    },
    created () {
        // check if the active tab is a youtube video and hide
        // add timestamp btn if not.
        chrome.tabs.query(
            {
                active: true, currentWindow: true,
                url: "https://www.youtube.com/watch?v=*",
            }, (tabs) => {
                this.isYoutubeVideoTab = tabs.length > 0;
            }
        );
        // retrieve data from local Chrome storage
        chrome.storage.local.get(null, (data) => {
            this.videos = data;
        });
    },

    methods: {
        // Send a request to the active youtube page to retrieve its timestamp.
        // https://developer.chrome.com/docs/extensions/mv2/messaging/
        sendTimestampRequest () {
            // No need to check if is Youtube video tab since btn only appears if it is
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                chrome.tabs.sendMessage(
                    tabs[0].id, {msg: "add-timestamp"}, (response) => {
                        // response format: {videoId, title, timestamp}
                        this.updateLocalStorage(response);
                        this.addTimestamp(response);
                    }
                );
            });
        },
        // update local Chrome storage with new timestamp
        updateLocalStorage(timestampData) {
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
                        // DEBUG
                        chrome.storage.local.get(null, (data) => {
                            console.log(data);
                        })
                    }
                );
            });
        },
        // add new timestamp to popup instance
        addTimestamp(timestampData) {
            const {videoId, title, timestamp} = timestampData;
            if (!(videoId in this.videos)) {
                // need to add new video using set to make added object reactive
                this.$set(this.videos, videoId, {
                    title: title,
                    timestamps: [timestamp],
                });
            } else {
                // push to existing video
                this.videos[videoId].timestamps.push(timestamp);
            }
        },
        // remove all timestamps from local storage then from popup instance
        clearAllTimestamps() {
            chrome.storage.local.clear();
            this.videos = {};
        },
        // remove single video and all its timestamps
        removeVideo(videoToRemove) {
            const {videoId} = videoToRemove;
            chrome.storage.local.remove(videoId);
            // needs to use $delete to be reactive
            this.$delete(this.videos, videoId);
        },
        // remove single timestamp of a video
        removeTimestamp(videoToRemove) {
            const {videoId, timestamp} = videoToRemove;
            chrome.storage.local.get(videoId, (data) => {
                let videoStorageMeta = data[videoId];
                const indexToRemove = videoStorageMeta.timestamps.indexOf(timestamp);
                // remove single timestamp
                videoStorageMeta.timestamps.splice(indexToRemove, 1);

                // update chrome storage and instance
                chrome.storage.local.set({
                    [videoId]: videoStorageMeta
                });
                this.videos[videoId] = videoStorageMeta;
            });
        }
    },
}
</script>


<style scoped>
button {
    height: 30px;
    width: 200px;
}
#add-timestamp-btn {
    background-color: aqua;
}
#remove-all-btn {
    background-color: red;
}
</style>
