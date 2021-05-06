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
            title="About"
        >
            <em>i</em>
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

export default {
    props: ["disableAddTimestamp", "contentScriptReady"],
    emits: ['new-timestamp'],
    data () {
        return {
            timestampLabel: ""
        }
    },
    computed: {
        inputPlaceholderText() {
            if (!this.contentScriptReady) {
                return "Please wait";
            }
            return this.disableAddTimestamp ? "Open a video first" : "Timestamp Label";
        },
        buttonText() {
            if (!this.contentScriptReady) {
                return "Loading...";
            }
            return this.disableAddTimestamp ? "Not a Video" : "+ Add";
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
                timestampData.label = this.timestampLabel;
                this.timestampLabel = "";
                this.$emit('new-timestamp', timestampData);
            });
        }
    }
}
</script>
