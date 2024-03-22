<template>
  <div id="popup" class="card">
    <PopupHeader/>

    <div id="popup-body" class="card-body p-0">
      <VideoList/>
    </div>

    <PopupFooter/>

    <!-- Bootstrap modal can not have fixed, absolute, or relative positioned parent. -->
    <!-- Will cause modal component to show underneath fade background -->
    <!-- https://weblog.west-wind.com/posts/2016/sep/14/bootstrap-modal-dialog-showing-under-modal-background -->
    <RemoveAllVideosModal/>
    <RemoveVideoModal/>
    <AboutModal/>
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
import { mapActions, mapMutations } from 'vuex';
import PopupHeader from './PopupHeader.vue';
import VideoList from './VideoList.vue';
import PopupFooter from './PopupFooter.vue';
import RemoveAllVideosModal from './RemoveAllVideosModal.vue';
import RemoveVideoModal from './RemoveVideoModal.vue';
import AboutModal from './AboutModal.vue';
import { sendMessageOnVideo } from '../common/obtainCurrentTab';

export default {
  components: {
    PopupHeader,
    VideoList,
    PopupFooter,
    RemoveAllVideosModal,
    RemoveVideoModal,
    AboutModal,
  },
  mounted() {
    // Initialize local data from chrome storage
    this.initializeVideos();

    // update popup instance data with new timestamp.
    // update msg is from background script.
    chrome.runtime.onMessage.addListener((request) => {
      if (request.msg === 'update-timestamp') {
        this.addVideoTimestampSynced(request.timestampData);
      } else if (request.msg === 'content-script-loaded') {
        // this block is for the following scenario:
        // 1) user opens a video via the popup OR immediately opens the popup
        //    upon loading a new video tab (and making it active tab)
        // 2) effects in popup is that contentScriptReady & isYoutubeVideo
        //    flags are disabled to prevent user from adding timestamp when
        //    content script hasn't been loaded yet (not able to access DOM yet).
        // 3) popup is still open, so it needs content script to notify popup
        //    (hence this listener) about the video and if it's ok to obtain timestamps.
        this.setContentScriptReady(true);
        this.setCurrentVideoId(request.videoId);
        this.setIsYouTubeVideo(request.videoAvailable);
      }
    });

    // this block is for the following scenario (similar to above):
    // 1) user opens a new video WITHOUT the popup being open
    // 2) user opens popup
    // 3) newly opened popup needs to know about the current video's information, hence
    //    this message to content script.
    sendMessageOnVideo({ msg: 'check-content-script-loaded' }, (response) => {
      // the if statement is required to prevent error in the
      // case of content script not running i.e. user is
      // not browsing youtube.
      if (!chrome.runtime.lastError && response) {
        if (response.msg === 'content-script-loaded') {
          this.setContentScriptReady(true);
          this.setCurrentVideoId(response.videoId);
          this.setIsYouTubeVideo(response.videoAvailable);
        }
      }
    });
  },
  methods: {
    ...mapActions(['initializeVideos', 'addVideoTimestampSynced']),
    ...mapMutations(['setIsYouTubeVideo', 'setContentScriptReady', 'setCurrentVideoId']),
  },
};
</script>
