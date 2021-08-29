<template>
    <div class="modal fade" id="remove-video-modal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-warning py-2">
                    <h5 class="modal-title">
                        <!-- warning icon -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle" viewBox="0 0 16 16">
                            <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
                            <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
                        </svg>
                        Warning
                    </h5>
                </div>
                <div class="modal-body py-2">
                    Please confirm to DELETE this video.
                </div>
                <div class="modal-footer py-2">
                    <button
                        type="button" class="btn btn-sm btn-secondary me-3" data-bs-dismiss="modal"
                    >
                        Cancel
                    </button>
                    <button
                        type="button" class="btn btn-sm btn-danger ml-3" data-bs-dismiss="modal"
                        @click="removeVideoSynced(removeTargetVideoId)"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState, mapActions} from 'vuex';

export default {
    methods: {
        ...mapActions(['removeVideoSynced']),
    },
    computed: {
        ...mapState({
            removeTargetVideoId: state => state.videosStore.removeTargetVideoId
        })
    }
}
</script>
