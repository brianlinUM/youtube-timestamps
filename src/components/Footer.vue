<template>
  <div id="popup-footer"
    class="
      card-footer position-sticky bottom-0
      d-flex justify-content-between align-items-center
    "
  >
    <img src="/images/logo.png" alt="logo">
    <h6>
      <span id="footer-title-left">YouTube</span>
      <span id="footer-title-right">Time Labels</span>
    </h6>

    <button
      type="button" class="btn btn-sm btn-danger"
      data-bs-toggle="modal" data-bs-target="#remove-all-modal"
      :disabled="isNoVideos" title="Remove all videos"
    >
      Remove All
    </button>
  </div>
</template>

<style scoped>
img {
  width: 32px;
}
#footer-title-left {
  color: red;
}
#footer-title-right {
  color: #3399FF;
}
</style>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    isNoVideos() {
      return Object.keys(this.videos).length === 0;
    },
    ...mapState({
      videos: (state) => state.videosStore.videos,
    }),
  },
};
</script>
