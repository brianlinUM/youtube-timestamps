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
#help-btn {
  height: 25px;
  width: 25px;
  border-radius: 50%;
  margin-left: 15px;
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
