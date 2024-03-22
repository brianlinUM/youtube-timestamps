/* eslint-disable no-param-reassign */
// Module for various boolean flags

const state = () => {
  // is the current tab a YT video?
  const isYouTubeVideo = false;
  // is the page content script loaded?
  const contentScriptReady = false;
  return { isYouTubeVideo, contentScriptReady };
};

const mutations = {
  setIsYouTubeVideo(_state, status) {
    _state.isYouTubeVideo = status;
  },
  setContentScriptReady(_state, status) {
    _state.contentScriptReady = status;
  },
};

export default {
  namespaced: false,
  state,
  mutations,
};
