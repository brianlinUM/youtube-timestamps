<template>
    <div>
        <a class="videoTimestamp" href="#" @click="changeTime(timestamp)">{{convertTimeFormat(timestamp)}}</a>
        <h5>{{label}}</h5>
        <RemoveButton @remove-confirmed="removeTimestamp"/>
    </div>
</template>

<script>
import RemoveButton from './RemoveButton.vue';
import queryCurrentTab from "../common/obtainCurrentTab.js";

export default {
    props: ['videoId', 'timestamp', 'label'],
    emits: ['remove-timestamp', 'change-video-and-time'],
    components: {RemoveButton},
    methods: {
        // converts from seconds to HH:MM:SS
        // https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
        convertTimeFormat(seconds) {
            let dateObj = new Date(0);
            dateObj.setSeconds(seconds);
            return dateObj.toISOString().substr(11, 8);
        },
        // sends request to content listener to change current video time
        changeTime (newTime) {
            queryCurrentTab((tabs) => {
                if (tabs.length > 0) {
                    chrome.tabs.sendMessage(
                        tabs[0].id, {msg: "change-time", timestamp: newTime}
                    );
                } else {
                    this.$emit('change-video-and-time', {newTime});
                }
            }, "https://www.youtube.com/watch?v=" + this.videoId + "*");
        },
        removeTimestamp() {
            this.$emit('remove-timestamp', {
                videoId: this.videoId,
                timestamp: this.timestamp
            });
        },
    }
}
</script>
