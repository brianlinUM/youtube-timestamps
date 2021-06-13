// Instance storage needs to be consistent with persistent storage:
// i.e. update in instance <--> update in chrome.storage
import Vue from "vue";
import * as PersistStore from "../../common/chromeStorageAPI.js";

// initialize state by pulling from persistent store
// {videoId: {title, timestamps:{timestamp: label}}}
const state = () => {
    let videos = {};
    // retrieve data from local Chrome storage
    PersistStore.getAllData((data) => {videos = data;});
    return {videos};
}

const getters = {

}

const mutations = {
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
    updateTimestampLabel (state, {videoId, timestamp, label}) {
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

const actions = {
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
        commit('updateTimestamplabel', updateData);
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
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
