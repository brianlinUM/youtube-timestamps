<template>
    <div id="popup" class="card">
        <PopupHeader @new-timestamp="addNewTimestamp"/>

        <div id="popup-body" class="card-body p-0">
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
    width: 360px;
    height: 600px;
}
/* https://stackoverflow.com/questions/1417934/how-to-prevent-scrollbar-from-repositioning-web-page */
#popup-body {
    overflow-y: scroll;
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
            // it is possible that label is not provided e.g. add by hotkey
            const newLabel = 'label' in timestampData ? timestampData.label : "";
            if (!(videoId in this.videos)) {
                // need to add new video using set to make added object reactive
                this.$set(this.videos, videoId, {
                    title: title,
                    timestamps: {[timestamp]: newLabel},
                });
            } else {
                // push to existing video. Need to set new object for reactivity
                // to work. Vue has difficulty updating nested objects otherwise.
                // https://forum.vuejs.org/t/nested-objects-and-reactivity-a-question/20535
                const {title, timestamps} = this.videos[videoId];
                timestamps[timestamp] = newLabel;
                this.$set(this.videos, videoId, {
                    title: title,
                    timestamps,
                });
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
        removeTimestamp(timestampToRemove) {
            const {videoId, timestamp} = timestampToRemove;
            Storage.updateSingleVideo(
                videoId,
                (data) => {
                    let videoStorageMeta = data[videoId];
                    delete videoStorageMeta.timestamps[timestamp];
                    this.videos[videoId] = videoStorageMeta;
                    return videoStorageMeta;
                }
            );
        }
    },
}
</script>
