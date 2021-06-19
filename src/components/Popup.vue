<template>
    <div id="popup" class="card">
        <PopupHeader
            :isYouTubeVideo="isYouTubeVideo"
            :contentScriptReady="contentScriptReady"
        />

        <div id="popup-body" class="card-body p-0">
            <VideoList
                @changed-video="()=>{isYouTubeVideo = true; contentScriptReady = false;}"
            />
        </div>

        <PopupFooter />
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
import {mapActions} from 'vuex';
import PopupHeader from "./Header.vue";
import VideoList from "./VideoList.vue";
import PopupFooter from "./Footer.vue";
import queryCurrentTab from "../common/obtainCurrentTab.js";

export default {
    components: {PopupHeader, VideoList, PopupFooter},
    data () {
        return {
            isYouTubeVideo: false,
            contentScriptReady: false
        }
    },
    mounted () {
        // Initialize local data from chrome storage
        this.initializeVideos();

        // update popup instance data with new timestamp.
        // update msg is from background script.
        chrome.runtime.onMessage.addListener((request) => {
            if (request.msg === "update-timestamp") {
                this.addVideoTimestampSynced(request.timestampData);
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
        ...mapActions(['initializeVideos', 'addVideoTimestampSynced']),
    },
}
</script>
