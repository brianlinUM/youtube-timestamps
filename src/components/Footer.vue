<template>
    <div id="popup-footer"
        class="
                card-footer position-sticky bottom-0
                d-flex justify-content-between align-items-center
            "
    >
        <h6 class="text-muted">YouTube Timestamps</h6>
        <RemoveButton
            :btnText="`Remove All`" :btnTextConfirm="`Confirm`"
            @remove-confirmed="removeAllDataSynced"
            :disableBtn='isNoVideos'
            :fillIcon="true"
        />
    </div>
</template>

<script>
import {mapState, mapActions} from 'vuex';
import RemoveButton from "./RemoveButton.vue";

export default {
    computed: {
        isNoVideos () {
            return Object.keys(this.videos).length == 0;
        },
        ...mapState({
            videos: state => state.videosStore.videos
        }),
    },
    components: {RemoveButton},
    methods: {
        ...mapActions(['removeAllDataSynced']),
    }
}
</script>
