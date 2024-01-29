/* eslint-disable no-param-reassign */
// Module for video data.
// Instance storage needs to be consistent with persistent storage for videos:
// i.e. update in instance <--> update in chrome.storage

import Vue from 'vue';
import * as PersistStore from '../../common/chromeStorageAPI';

// {videoId: {title, timestamps:{timestamp: label}}}
const state = () => {
  const videos = {};
  // not tracked in persistent storage:
  const currentVideoId = '';
  // since we only have one remove video modal component for all videos,
  // (to prevent duplication) we need to save which video we are targeting
  // for removal in the modal.
  const removeTargetVideoId = '';
  return { videos, currentVideoId, removeTargetVideoId };
};

const getters = {
  orderedVideos: (_state) => {
    const videosList = Object.keys(_state.videos)
      .map((videoId) => [videoId, _state.videos[videoId]]);
    // sort videos by title
    videosList.sort((video1, video2) => {
      const title1 = video1[1].title.toLowerCase();
      const title2 = video2[1].title.toLowerCase();
      if (title1 < title2) {
        return -1;
      }
      if (title1 > title2) {
        return 1;
      }
      // same titles
      return 0;
    });
    return videosList;
  },
  filteredVideos: (_state, _getters) => {
    const { titleQueryString } = _getters;
    // return all videos if there is no query
    if (titleQueryString === '') return _getters.orderedVideos;

    // return videos with titles that match the query
    return _getters.orderedVideos.filter((video) => {
      const videoTitle = video[1].title.toLowerCase();
      return videoTitle.includes(titleQueryString);
    });
  },
};

const mutations = {
  overwriteVideos(_state, videos) {
    _state.videos = videos;
  },
  addVideo(_state, { videoId, title }) {
    // needs to use Vue.set to be reactive
    Vue.set(_state.videos, videoId, { title, timestamps: {} });
  },
  // it is possible that label is not provided e.g. add by hotkey
  addTimestamp(_state, { videoId, timestamp, label = '' }) {
    Vue.set(_state.videos[videoId].timestamps, timestamp, label);
  },
  updateTitle(_state, { videoId, title: newTitle }) {
    _state.videos[videoId].title = newTitle;
  },
  updateLabel(_state, { videoId, timestamp, label }) {
    _state.videos[videoId].timestamps[timestamp] = label;
  },
  removeAllData(_state) {
    _state.videos = {};
  },
  removeVideo(_state, videoId) {
    // needs to use Vue.delete to be reactive
    Vue.delete(_state.videos, videoId);
  },
  removeTimestamp(_state, { videoId, timestamp }) {
    Vue.delete(_state.videos[videoId].timestamps, timestamp);
  },
  setCurrentVideoId(_state, newVideoId) {
    _state.currentVideoId = newVideoId;
  },
  setRemoveTargetVideoId(_state, targetVideoId) {
    _state.removeTargetVideoId = targetVideoId;
  },
};

// Each state mutation in actions will be matched by a call to PersistStore
// to keep vuex state consistent with persistent storage.
const actions = {
  // Initialize state by pulling from persistent store.
  // getAllData has to be called as an action since its async.
  // Would not work in state()
  initializeVideos({ commit }) {
    // retrieve data from local Chrome storage
    PersistStore.getAllData((data) => {
      commit('overwriteVideos', data);
    });
  },
  // Adds a timestamp to a video, creating a new video record if it isn't
  // already recorded.
  // timestampData: {videoId, title, timestamp, label?}
  addVideoTimestampSynced({ state: _state, commit }, timestampData) {
    PersistStore.setVideoTimestamp(timestampData, PersistStore.printAllData);
    if (!(timestampData.videoId in _state.videos)) {
      commit('addVideo', timestampData);
    }
    commit('addTimestamp', timestampData);
  },
  updateTitleSynced({ commit }, updateData) {
    PersistStore.updateVideoTitle(updateData);
    commit('updateTitle', updateData);
  },
  updateTimestampLabelSynced({ commit }, updateData) {
    PersistStore.updateTimestampLabel(updateData);
    commit('updateLabel', updateData);
  },
  removeAllDataSynced({ commit }) {
    PersistStore.removeAllData();
    commit('removeAllData');
  },
  removeVideoSynced({ commit }, videoId) {
    PersistStore.removeVideo(videoId);
    commit('removeVideo', videoId);
  },
  removeTimestampSynced({ commit }, removeData) {
    PersistStore.removeVideoTimestamp(removeData);
    commit('removeTimestamp', removeData);
  },
};

export default {
  namespaced: false,
  state,
  getters,
  actions,
  mutations,
};
