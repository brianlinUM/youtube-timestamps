// Module for video data.
// Instance storage needs to be consistent with persistent storage for videos:
// i.e. update in instance <--> update in chrome.storage

import Vue from "vue";
import * as PersistStore from "../../common/chromeStorageAPI.js";

// {videoId: {title, timestamps:{timestamp: label}}}
const state = () => {
    let videos = {};
    // not tracked in persistent storage:
    let currentVideoId = "";
    return {videos, currentVideoId};
}

const getters = {
    orderedVideos: (state) => {
        let videosList = Object.keys(state.videos).map((videoId) => [videoId, state.videos[videoId]]);
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
    filteredVideos: (state, getters) => {
        const queryString = getters.queryString;
        // return all videos if there is no query
        if (queryString == "") return getters.orderedVideos;
    
        // return videos with titles that match the query
        return getters.orderedVideos.filter(video => {
            const videoTitle = video[1].title.toLowerCase();
            return videoTitle.includes(queryString);
        });
    }
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
    setCurrentVideoId (state, newVideoId) {
        state.currentVideoId = newVideoId;
    }
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
    getters,
    actions,
    mutations
}
