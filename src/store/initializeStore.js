import Vue from 'vue';
import Vuex from 'vuex';
import videosStore from './modules/videos.js';
import flagsStore from './modules/flags.js';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        videosStore,
        flagsStore
    }
})
