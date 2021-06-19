// Module for video data.
// Instance storage needs to be consistent with persistent storage:
// i.e. update in instance <--> update in chrome.storage

import Vue from "vue";
import * as PersistStore from "../../common/chromeStorageAPI.js";

// {videoId: {title, timestamps:{timestamp: label}}}
const state = () => {
    let videos = {};
    return {videos};
}

const mutations = {
    overwriteVideos (state, videos) {
        state.videos = videos;
    },
    addVideo (state, {videoId, title}) {
        // needs to use Vue.set to be reactive
        Vue.set(state.videos, videoId, {title, timestamps: {}});
    },
    // it is possible that label is not provided e.g. add by hotkey
    addTimestamp (state, {videoId, timestamp, label=""}) {
        Vue.set(state.videos[videoId].timestamps, timestamp, label);
    },
    updateTitle (state, {videoId, title: newTitle}) {
        state.videos[videoId].title = newTitle;
    },
    updateLabel (state, {videoId, timestamp, label}) {
        state.videos[videoId].timestamps[timestamp] = label;
    },
    removeAllData (state) {
        state.videos = {};
    },
    removeVideo (state, videoId) {
        // needs to use Vue.delete to be reactive
        Vue.delete(state.videos, videoId);
    },
    removeTimestamp (state, {videoId, timestamp}) {
        Vue.delete(state.videos[videoId].timestamps, timestamp);
    },
}

// Each state mutation in actions will be matched by a call to PersistStore
// to keep vuex state consistent with persistent storage.
const actions = {
    // Initialize state by pulling from persistent store.
    // getAllData has to be called as an action since its async.
    // Would not work in state()
    initializeVideos ({commit}) {
        // retrieve data from local Chrome storage
        PersistStore.getAllData((data) => {
            commit('overwriteVideos', data);
        });
    },
    // Adds a timestamp to a video, creating a new video record if it isn't
    // already recorded.
    // timestampData: {videoId, title, timestamp, label?}
    addVideoTimestampSynced ({state, commit}, timestampData) {
        PersistStore.setVideoTimestamp(timestampData, PersistStore.printAllData);
        if (!(timestampData.videoId in state.videos)) {
            commit('addVideo', timestampData);
        }
        commit('addTimestamp', timestampData);
    },
    updateTitleSynced ({commit}, updateData) {
        PersistStore.updateVideoTitle(updateData);
        commit('updateTitle', updateData);
    },
    updateTimestampLabelSynced ({commit}, updateData) {
        PersistStore.updateTimestampLabel(updateData);
        commit('updateLabel', updateData);
    },
    removeAllDataSynced ({commit}) {
        PersistStore.removeAllData();
        commit('removeAllData');
    },
    removeVideoSynced({commit}, videoId) {
        PersistStore.removeVideo(videoId);
        commit('removeVideo', videoId);
    },
    removeTimestampSynced({commit}, removeData) {
        PersistStore.removeVideoTimestamp(removeData);
        commit('removeTimestamp', removeData);
    }
}

export default {
    namespaced: false,
    state,
    actions,
    mutations
}
