import Vue from 'vue';
import Vuex from 'vuex';
import videosStore from './modules/videos.js'


Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        videosStore
    }
})
