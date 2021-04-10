<template>
    <div
        id="popup-header"
        class="
                card-header position-sticky top-0
                d-flex justify-content-between align-items-center
            "
    >
        <form v-on:submit.prevent="sendTimestampRequest" id="timestamp-form" class="input-group">
            <input
                type="text" class="form-control"
                :placeholder="inputPlaceholderText" v-model="timestampLabel"
                :disabled="disableAddTimestamp"
            >
            <button
                type="button" :class="buttonColor"
                id="add-timestamp-btn"
                :disabled="disableAddTimestamp"
                @click="sendTimestampRequest"
            >
                {{ buttonText }}
            </button>
        </form>

        <button
            id="help-btn"
            class="
                    btn btn-sm btn-outline-secondary
                    d-flex justify-content-center align-items-center
                    "
        >
            ?
        </button>
    </div>
</template>

<style scoped>
#help-btn {
    height: 25px;
    width: 25px;
    border-radius: 50%;
    margin-left: 15px;
}
</style>

<script>
import sendObtainTimestampRequest from "../common/obtainTimestamp.js";
import queryCurrentTab from "../common/obtainCurrentTab.js";

export default {
    emits: ['new-timestamp'],
    mounted () {
        // we only enable add timestamp button if
        // the current tab is a YouTube video
        queryCurrentTab( (tabs) => {
            this.disableAddTimestamp = tabs.length == 0;
        }, "https://www.youtube.com/watch?v=*");
    },
    data () {
        return {
            disableAddTimestamp: true,
            timestampLabel: ""
        }
    },
    computed: {
        inputPlaceholderText() {
            return this.disableAddTimestamp ? "Open a video first" : "Timestamp Label";
        },
        buttonText() {
            return this.disableAddTimestamp ? "Not a Video" : "Add Timestamp";
        },
        buttonColor() {
            return [
                "btn", "shadow-none",
                {
                    "btn-primary": !this.disableAddTimestamp,
                    "btn-warning": this.disableAddTimestamp
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
                this.timestampLabel = "";
                this.$emit('new-timestamp', timestampData);
            });
        }
    }
}
</script>
