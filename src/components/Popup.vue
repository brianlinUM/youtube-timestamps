<template>
    <div id="popup" class="card">
        <PopupHeader @new-timestamp="addNewTimestamp"/>

        <div id="popup-body" class="card-body overflow-auto">
            <VideoList
                :videosProp="videos"
                @remove-timestamp="removeTimestamp"
                @remove-video="removeVideo"
            />
        </div>

        <PopupFooter @remove-all="removeAllTimestamps"/>
    </div>
</template>

<style scoped>
#popup {
    width: 350px;
    height: 600px;
}
</style>

<script>
import PopupHeader from "./Header.vue";
import VideoList from "./VideoList.vue";
import PopupFooter from "./Footer.vue";
import * as Storage from "../common/chromeStorageAPI.js";

export default {
    components: {PopupHeader, VideoList, PopupFooter},
    data () {
        return {
            videos: {},
        }
    },
    mounted () {
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
        // add new timestamp to both storage and popup instance
        addNewTimestamp(timestampData) {
            Storage.addTimestampToStorage(timestampData, Storage.printAllData);
            this.addInstanceTimestamp(timestampData);
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
        removeAllTimestamps() {
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
