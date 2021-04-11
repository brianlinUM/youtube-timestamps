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
            @remove-confirmed="removeAllTimestamps"
        />
    </div>
</template>

<script>
import RemoveButton from "./RemoveButton.vue";

export default {
    emits: ['remove-all'],
    components: {RemoveButton},
    methods: {
        removeAllTimestamps() {
            // parent needs to handle removal since it holds the data
            this.$emit('remove-all');
        }
    }
}
</script>
