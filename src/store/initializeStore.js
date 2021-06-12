import Vue from 'vue';
import Vuex from 'vuex';
import videos from './modules/videosStore.js'


Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        videos
    }
})
