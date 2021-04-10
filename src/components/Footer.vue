<template>
    <div id="popup-footer"
        class="
                card-footer position-sticky bottom-0
                d-flex justify-content-between align-items-center
            "
    >
        <h6 class="text-muted">YouTube Timestamps</h6>
        <button
            type="button" 
            class="
                btn btn-danger btn-sm shadow-none
                "
            id="remove-all-btn"
            @click="removeAllTimestamps"
        >
            Remove All
        </button>
    </div>
</template>

<script>
export default {
    emits: ['remove-all'],
    methods: {
        removeAllTimestamps() {
            // parent needs to handle removal since it holds the data
            this.$emit('remove-all');
        }
    }
}
</script>