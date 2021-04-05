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
import * as Storage from "../common/chromeStorageAPI.js";
import sendObtainTimestampRequest from "../common/obtainTimestamp.js";
import queryCurrentTab from "../common/obtainCurrentTab.js";

export default {
    components: {VideoList},
    data () {
        return {
            videos: {},
            isYoutubeVideoTab: false,
        }
    },
    mounted () {
        // check if the active tab is a youtube video and hide
        // add timestamp btn if not.
        queryCurrentTab( (tabs) => {
            this.isYoutubeVideoTab = tabs.length > 0;
        }, "https://www.youtube.com/watch?v=*");

        // retrieve data from local Chrome storage
        Storage.getAllData((data) => {this.videos = data;});

        // update popup instance data with new timestamp.
        // update msg is from background script.
        chrome.runtime.onMessage.addListener((request) => {
            if (request.msg === "update-timestamp") {
                this.addInstanceTimestamp(request.timestampData);
            }
        });
    },

    methods: {
        // Send a request to the active youtube page to retrieve its timestamp.
        // https://developer.chrome.com/docs/extensions/mv2/messaging/
        sendTimestampRequest() {
            sendObtainTimestampRequest((response) => {
                Storage.addTimestampToStorage(response, Storage.printAllData);
                this.addInstanceTimestamp(response);
            });
        },
        // add new timestamp to popup instance
        addInstanceTimestamp(timestampData) {
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
            Storage.removeAllData();
            this.videos = {};
        },
        // remove single video and all its timestamps
        removeVideo(videoToRemove) {
            const {videoId} = videoToRemove;
            Storage.removeVideo(videoId);
            // needs to use $delete to be reactive
            this.$delete(this.videos, videoId);
        },
        // remove single timestamp of a video
        removeTimestamp(videoToRemove) {
            const {videoId, timestamp} = videoToRemove;
            Storage.updateSingleVideo(
                videoId,
                (data) => {
                    let videoStorageMeta = data[videoId];
                    const indexToRemove = videoStorageMeta.timestamps.indexOf(timestamp);
                    // remove single timestamp
                    videoStorageMeta.timestamps.splice(indexToRemove, 1);
                    // update current instance
                    this.videos[videoId] = videoStorageMeta;
                    return videoStorageMeta;
                }
            );
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
