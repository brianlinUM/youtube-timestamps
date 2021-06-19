// Popup vue root and entry.

import Vue from 'vue';
import store from './store/initializeStore.js';
import Popup from "./components/Popup.vue";
import css from "./css/popup.css";


new Vue({
    el: "#popup",
    store,
    components: { Popup },
    render (createElement) {
        return createElement(
            'popup',
            {}
        )
    },
})
