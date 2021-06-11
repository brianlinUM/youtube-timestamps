import Vue from 'vue';
import Vuex from 'vuex';
import storeFactory from './store/storeFactory.js';
import Popup from "./components/Popup.vue";
import css from "./css/popup.css";

Vue.use(Vuex);

new Vue({
    el: "#popup",
    store: storeFactory(),
    components: { Popup },
    render (createElement) {
        return createElement(
            'popup',
            {}
        )
    },
})
