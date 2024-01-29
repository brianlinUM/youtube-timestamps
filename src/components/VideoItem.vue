<template>
  <div class="accordion-item">
    <div class="accordion-header">
      <h2 class="videoTitle m-0">
        <!-- video title (and accordion toggle) -->
        <button
          class="accordion-button shadow-none collapsed" type="button"
          data-bs-toggle="collapse" :data-bs-target="'#body'+videoId"
          title="Toggle Video"
        >
          <span :class="currentVideoClass">{{videoMeta.title}}</span>
        </button>
      </h2>
    </div>
    <!-- collapsible accordion body -->
    <div :id="'body'+videoId" class="accordion-collapse collapse"
      data-bs-parent="#videos-list"
    >
      <div class="accordion-body p-0">
        <ul class="list-group list-group-flush p-0">
          <li class="list-group-item p-0">
            <VideoNav
              :videoId="videoId" :videoTitle="videoMeta.title"  @play-video="changeVideo(0)"
            />
          </li>
          <!-- list timestamps -->
          <li
            v-for="(label, timestamp) in filteredTimestamps" :key="timestamp"
            class="list-group-item p-2"
          >
            <TimestampItem
              :timestamp="timestamp" :label="label" :videoId="videoId"
              @change-video-and-time="changeVideoAndTime"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import VideoNav from './VideoNav.vue';
import TimestampItem from './TimestampItem.vue';
import { queryCurrentTab } from '../common/obtainCurrentTab';

export default {
  props: ['videoMeta', 'videoId', 'isCurrentVideo'],
  components: { VideoNav, TimestampItem },
  methods: {
    ...mapMutations(['setIsYouTubeVideo', 'setContentScriptReady', 'setCurrentVideoId']),
    // change current tab to newly loaded YouTube Video (can be same video)
    changeVideo(newTime) {
      const newUrl = `https://www.youtube.com/watch?v=${this.videoId}&t=${newTime}`;
      queryCurrentTab((tabs) => {
        chrome.tabs.update(tabs[0].id, { url: newUrl });
      });

      // need to tell that we have changed to a youtube video
      // so that header can update its button/form state.
      this.setIsYouTubeVideo(true);
      this.setContentScriptReady(false);
      this.setCurrentVideoId(this.videoId);
    },
    // Called when a timestamp is clicked and current tab
    // is not the matching video.
    changeVideoAndTime({ newTime }) {
      this.changeVideo(newTime);
    },
  },
  computed: {
    currentVideoClass() {
      return { highlightedVideo: this.isCurrentVideo };
    },
    // timestamps with labels matching the label query.
    filteredTimestamps() {
      const { labelQuery } = this.$store.state.searchQueryStore;
      // allow all if no query.
      if (labelQuery === '') {
        return this.videoMeta.timestamps;
      }

      // construct filter for js object
      // https://stackoverflow.com/questions/5072136/javascript-filter-for-objects
      const objFilter = (obj, predicate) => Object.fromEntries(
        Object.entries(obj).filter(predicate),
      );

      return objFilter(
        this.videoMeta.timestamps,
        ([, label]) => label.toLowerCase().includes(labelQuery),
      );
    },
  },
};
</script>

<style scoped>
.videoTitle {
  font-size: 15px;
}
.highlightedVideo {
  color: #198754;
}
.videoTimestamp {
  font-size: 12px;
}
</style>
