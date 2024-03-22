// entry point for vuex store
import Vue from 'vue';
import Vuex from 'vuex';
import videosStore from './modules/videos';
import flagsStore from './modules/flags';
import searchQueryStore from './modules/search';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    videosStore,
    flagsStore,
    searchQueryStore,
  },
});
