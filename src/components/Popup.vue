<template>
    <div id="popup" class="card">
        <PopupHeader
            @new-timestamp="addNewTimestamp"
            :isYouTubeVideo="isYouTubeVideo"
            :contentScriptReady="contentScriptReady"
        />

        <div id="popup-body" class="card-body p-0">
            <VideoList
                :videosProp="videos"
                @remove-timestamp="removeTimestamp"
                @remove-video="removeVideo"
                @changed-video="()=>{isYouTubeVideo = true; contentScriptReady = false;}"
                @update-title="updateTitle"
                @update-timestamp-label="updateTimestampLabel"
            />
        </div>

        <PopupFooter
            @remove-all="removeAllTimestamps" :isNoVideos="isNoVideos"
        />
    </div>
</template>

<style scoped>
#popup {
    width: 380px;
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
import queryCurrentTab from "../common/obtainCurrentTab.js";

export default {
    components: {PopupHeader, VideoList, PopupFooter},
    data () {
        return {
            videos: {},
            isYouTubeVideo: false,
            contentScriptReady: false
        }
    },
    computed: {
        isNoVideos() {
            return Object.keys(this.videos).length == 0;
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
            } else if (request.msg === "content-script-loaded") {
                this.contentScriptReady = true;
            }
        });

        // we only enable add timestamp button in header if
        // the current tab is a YouTube video
        queryCurrentTab( (tabs) => {
            this.isYouTubeVideo = tabs.length > 0;
            if (this.isYouTubeVideo) {
                chrome.tabs.sendMessage(
                    tabs[0].id, {msg: "check-content-script-loaded"},
                    (response) => {
                        if (chrome.runtime.lastError || !response) {}
                        else if (response.msg === "content-script-loaded") {
                            this.contentScriptReady = true;
                        }
                    }
                );
            }
        }, "https://www.youtube.com/watch?v=*");
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
                    title,
                    timestamps: {[timestamp]: newLabel},
                });
            } else {
                // push to existing video. Need to set new object for reactivity
                // to work. Vue has difficulty updating nested objects otherwise.
                // https://forum.vuejs.org/t/nested-objects-and-reactivity-a-question/20535
                const {title, timestamps} = this.videos[videoId];
                timestamps[timestamp] = newLabel;
                this.$set(this.videos, videoId, {
                    title,
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
        },
        // update a video's title with the given new one, in storage and instance
        updateTitle(changeData) {
            const {videoId, title} = changeData;
            let {timestamps} = this.videos[videoId];
            const newVideoMeta = {title, timestamps}
            Storage.updateSingleVideo(videoId, (data) => {
                return newVideoMeta;
            });
            this.$set(this.videos, videoId, newVideoMeta);
        },
        // update the label of a timestamp for given video
        updateTimestampLabel(changeData) {
            const {videoId, timestamp, label} = changeData;
            const {title} = this.videos[videoId];

            const timestampData = {videoId, title, timestamp, label}
            // These methods actually updates existing timestamp data
            Storage.addTimestampToStorage(timestampData);
            this.addInstanceTimestamp(timestampData);
        }
    },
}
</script>
