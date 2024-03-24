<template>
  <div class="card">
    <h5 class="card-header">Export all data as JSON</h5>
    <div class="card-body">
      <p>
        This is useful for backing up your data, or transferring it to another device.
        JSON can be viewed by opening the file with your browser.
      </p>
      <p>
        Click the following button to start download prompt:
      </p>
      <button type="button" @click="downloadExport"
        class="btn btn-primary btn-sm"
        :disabled="isNoVideos" :title="tooltipText"
      >
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getAllData } from '../common/chromeStorageAPI';

export default {
  computed: {
    ...mapState({
      isNoVideos: (state) => Object.keys(state.videosStore.videos).length === 0,
    }),
    buttonText() {
      return this.isNoVideos ? 'No videos to export' : 'Export File';
    },
    tooltipText() {
      return this.isNoVideos ? '' : 'Click to download';
    },
  },
  methods: {
    downloadExport() {
      // this obtains from persistant store rather than app state.
      // better since this is the source of truth.
      getAllData((allData) => {
        const result = JSON.stringify(allData);
        const url = `data:application/json,${result}`;

        // Save as file
        chrome.downloads.download({
          url,
          saveAs: true,
          filename: 'youtubeTimeLabelsExport.json',
        });
      });
    },
  },
};
</script>
