<template>
  <div class="modal fade" id="setting-modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div id="about-modal-header" class="modal-header py-2">
          <h5 class="modal-title">
            Settings
          </h5>
        </div>
        <div class="modal-body py-2">
          <p>Delete Button:</p>
          <button
            type="button" class="btn btn-sm btn-danger ml-3" data-bs-dismiss="modal"
            @click="removeAllDataSynced" :disabled="isNoVideos"
          >
            Remove all videos
          </button>
        </div>
        <div class="modal-footer py-2">
          <button
            type="button" class="btn btn-sm btn-secondary me-3" data-bs-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#about-modal-header {
  background-color: #717a83;
}
</style>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    isNoVideos() {
      return Object.keys(this.videos).length === 0;
    },
    ...mapState({
      videos: (state) => state.videosStore.videos,
    }),
  },
  methods: {
    ...mapActions(['removeAllDataSynced']),
  },
};
</script>
