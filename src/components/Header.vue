<template>
    <div id="popup-header" class="card-header position-sticky top-0">
        <button 
            type="button" :class="buttonColor"
            id="add-timestamp-btn"
            :disabled="disableButton" 
            @click="sendTimestampRequest"
        >
            {{ buttonText }}
        </button>
    </div>
</template>

<script>
import sendObtainTimestampRequest from "../common/obtainTimestamp.js";
import queryCurrentTab from "../common/obtainCurrentTab.js";

export default {
    emits: ['new-timestamp'],
    mounted () {
        // we only enable add timestamp button if
        // the current tab is a YouTube video
        queryCurrentTab( (tabs) => {
            this.disableButton = tabs.length == 0;
        }, "https://www.youtube.com/watch?v=*");
    },
    data () {
        return {
            disableButton: true,
        }
    },
    computed: {
        buttonText() {
            return this.disableButton ? "Not a Video" : "Add Timestamp";
        },
        buttonColor() {
            return [
                "btn", "shadow-none",
                {
                    "btn-primary": !this.disableButton,
                    "btn-warning": this.disableButton
                }
            ]
        }
    },
    methods: {
        // Send a request to the active youtube page to retrieve its timestamp.
        // https://developer.chrome.com/docs/extensions/mv2/messaging/
        sendTimestampRequest() {
            // let parent handle both storage and instance updates.
            // This focus on retrieving timestamp only
            sendObtainTimestampRequest((timestampData) => {
                this.$emit('new-timestamp', timestampData)
            });
        }
    }
}
</script>
