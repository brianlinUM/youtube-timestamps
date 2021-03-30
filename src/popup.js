import Vue from 'vue';
import Popup from "./components/Popup.vue";
import css from "./css/popup.css";


new Vue({
    el: "#popup",
    components: { Popup },
    render (createElement) {
        return createElement(
            'popup',
            {}
        )
    },
})
