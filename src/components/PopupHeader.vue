<template>
  <div
    id="popup-header"
    class="
      card-header position-sticky top-0
      d-flex flex-column
    "
  >
    <div class="d-flex justify-content-between align-items-center mb-2">
      <form v-on:submit.prevent="sendTimestampRequest" id="timestamp-form" class="input-group">
        <input
          type="text" class="form-control"
          :placeholder="inputPlaceholderText" v-model="timestampLabel"
          :disabled="disableAddTimestamp"
        >
        <!-- add timestamp button -->
        <button
          type="button" :class="buttonColor"
          id="add-timestamp-btn"
          :disabled="disableAddTimestamp"
          @click="sendTimestampRequest"
        >
          {{ buttonText }}
        </button>
      </form>

      <button
        id="help-btn"
        class="
          btn btn-sm btn-outline-secondary
          d-flex justify-content-center align-items-center
        "
        data-bs-toggle="modal" data-bs-target="#about-modal"
        title="About"
      >
        <em>i</em>
      </button>
    </div>

    <Searchbar/>
  </div>
</template>

<style scoped>
#help-btn {
  height: 25px;
  width: 25px;
  border-radius: 50%;
  margin-left: 15px;
}
</style>

<script>
/* eslint-disable no-param-reassign */
import { mapState, mapActions } from 'vuex';
import Searchbar from './HeaderSearchbar.vue';
import { sendObtainTimestampRequest } from '../common/obtainTimestamp';

export default {
  components: { Searchbar },
  data() {
    return {
      timestampLabel: '',
    };
  },
  computed: {
    ...mapState({
      isYouTubeVideo: (state) => state.flagsStore.isYouTubeVideo,
      contentScriptReady: (state) => state.flagsStore.contentScriptReady,
    }),
    // Only enable adding timestamps if is both YT video page and content script
    // has loaded.
    disableAddTimestamp() {
      return !this.isYouTubeVideo || !this.contentScriptReady;
    },
    inputPlaceholderText() {
      if (!this.isYouTubeVideo) {
        return 'Open a video first';
      }
      return !this.contentScriptReady ? 'Please wait' : 'Timestamp Label';
    },
    buttonText() {
      if (!this.isYouTubeVideo) {
        return 'Not a Video';
      }
      return !this.contentScriptReady ? 'Loading...' : '+ Add';
    },
    buttonColor() {
      return [
        'btn', 'shadow-none',
        {
          'btn-primary': !this.disableAddTimestamp,
          'btn-warning': this.disableAddTimestamp,
        },
      ];
    },
  },
  methods: {
    ...mapActions(['addVideoTimestampSynced']),
    // Send a request to the active youtube page to retrieve its timestamp.
    // https://developer.chrome.com/docs/extensions/mv2/messaging/
    sendTimestampRequest() {
      // let parent handle both storage and instance updates.
      // This focus on retrieving timestamp only
      sendObtainTimestampRequest((timestampData) => {
        if (timestampData) {
          timestampData.label = this.timestampLabel;
          this.timestampLabel = '';
          this.addVideoTimestampSynced(timestampData);
        }
      });
    },
  },
};
</script>
