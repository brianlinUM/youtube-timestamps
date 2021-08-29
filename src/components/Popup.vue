<template>
    <div id="popup" class="card">
        <PopupHeader/>

        <div id="popup-body" class="card-body p-0">
            <VideoList/>
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
import {mapActions, mapMutations} from 'vuex';
import PopupHeader from "./Header.vue";
import VideoList from "./VideoList.vue";
import PopupFooter from "./Footer.vue";
import {queryCurrentTab} from "../common/obtainCurrentTab.js";

export default {
    components: {PopupHeader, VideoList, PopupFooter},
    mounted () {
        // Initialize local data from chrome storage
        this.initializeVideos();

        // update popup instance data with new timestamp.
        // update msg is from background script.
        chrome.runtime.onMessage.addListener((request) => {
            if (request.msg === "update-timestamp") {
                this.addVideoTimestampSynced(request.timestampData);
            } else if (request.msg === "content-script-loaded") {
                this.setContentScriptReady(true);
            } else if (request.msg === "update-current-videoId") {
                this.setCurrentVideoId(request.videoId);
            }
        });

        // we only enable add timestamp button in header if
        // the current tab is a YouTube video
        queryCurrentTab( (tabs) => {
            const localIsYouTubeVideo = tabs.length > 0;
            this.setIsYouTubeVideo(localIsYouTubeVideo);
            // contentScriptReady is false by default. Leave as false if not
            // YT video. If is YT video, then check if content script is loaded.
            if (localIsYouTubeVideo) {
                chrome.tabs.sendMessage(
                    tabs[0].id, {msg: "check-content-script-loaded"},
                    (response) => {
                        // the if statement is required to prevent error in the
                        // case of content script not running i.e. user is
                        // not browsing youtube.
                        if (chrome.runtime.lastError || !response) {}
                        else if (response.msg === "content-script-loaded") {
                            this.setContentScriptReady(true);
                        }
                    }
                );
            }
        }, "https://www.youtube.com/watch?v=*");
    },
    methods: {
        ...mapActions(['initializeVideos', 'addVideoTimestampSynced']),
        ...mapMutations(['setIsYouTubeVideo', 'setContentScriptReady', 'setCurrentVideoId']),
    },
}
</script>
