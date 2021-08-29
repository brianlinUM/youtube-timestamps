<template>
    <div id="popup-footer"
        class="
                card-footer position-sticky bottom-0
                d-flex justify-content-between align-items-center
            "
    >
        <h6 class="text-muted">YouTube Timestamps</h6>

        <button
            type="button" class="btn btn-sm btn-danger"
            data-bs-toggle="modal" data-bs-target="#remove-all-modal"
            :disabled="isNoVideos"
        >
            Remove All
        </button>
    </div>
</template>

<script>
import {mapState} from 'vuex';

export default {
    computed: {
        isNoVideos () {
            return Object.keys(this.videos).length == 0;
        },
        ...mapState({
            videos: state => state.videosStore.videos
        }),
    },
}
</script>
