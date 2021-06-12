// Instance storage needs to be consistent with persistent storage:
// i.e. update in instance <--> update in chrome.storage
import Vue from "vue";
import * as Storage from "../../common/chromeStorageAPI.js";

// initialize state by pulling from persistent store
// {videoId: {title, timestamps:{timestamp: label}}}
const state = () => {
    let videos = {};
    // retrieve data from local Chrome storage
    Storage.getAllData((data) => {videos = data;});
    return {videos};
}

const getters = {

}

const mutations = {
    addVideo (state, {videoId, title}) {
        Vue.set(state.videos, videoId, {title, timestamps: {}});
    },
    // it is possible that label is not provided e.g. add by hotkey
    addTimestamp (state, {videoId, timestamp, label=""}) {
        Vue.set(state.videos[videoId].timestamps, timestamp, label);
    },
    setTitle (state, {videoId, title: newTitle}) {
        state.videos[videoId].title = newTitle;
    },
    setTimestampLabel (state, {videoId, timestamp, label: newLabel}) {
        state.videos[videoId].timestamps[timestamp].label = newLabel;
    },
    removeAllTimestamps (state) {
        state.videos = {};
    },
    removeVideo (state, {videoId}) {
        // needs to use Vue.delete to be reactive
        Vue.delete(state.videos, videoId);
    },
    removeTimestamp (state, {videoId, timestamp}) {
        Vue.delete(state.videos[videoId].timestamps, timestamp);
    },
}

const actions = {
    
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
