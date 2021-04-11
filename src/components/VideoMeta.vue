<template>
    <div class="accordion-item">
        <div class="accordion-header">
            <h2 class="videoTitle m-0">
                <button
                    class="accordion-button shadow-none collapsed" type="button"
                    data-bs-toggle="collapse" :data-bs-target="'#body'+videoIdProp"
                >
                    {{metaProp.title}}
                </button>
            </h2>
        </div>

        <div :id="'body'+videoIdProp" class="accordion-collapse collapse"
            data-bs-parent="#videos-list"
        >
            <div class="accordion-body p-0">
                <ul class="list-group list-group-flush p-0">
                    <li class="list-group-item p-0">
                        <VideoNav :videoIdProp="videoIdProp" :titleProp="metaProp.title"  @play-video="changeVideo(0)"/>
                    </li>
                    <li
                        v-for="(label, timestamp) in metaProp.timestamps" :key="timestamp"
                        class="list-group-item"
                    >
                        <a class="videoTimestamp" href="#" @click="changeTime(timestamp)">{{convertTimeFormat(timestamp)}}</a>
                        <h5>{{label}}</h5>
                        <!-- emit event to grandparent as it handles the data -->
                        <button type="button" class="remove-timestamp-btn"
                            @click="$parent.$emit('remove-timestamp', {
                                videoId: videoIdProp,
                                timestamp: timestamp
                            })"
                        >
                            Remove
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>


<script>
import VideoNav from "./VideoNav.vue";
import queryCurrentTab from "../common/obtainCurrentTab.js";

export default {
    props: ["metaProp", "videoIdProp"],
    components: {VideoNav},
    emits: ['remove-timestamp'],
    methods: {
        // change current tab to new YouTube Video
        changeVideo(newTime) {
            const newUrl = "https://www.youtube.com/watch?v=" + this.videoIdProp + "&t=" + newTime;
            queryCurrentTab((tabs) => {
                chrome.tabs.update(tabs[0].id, {url: newUrl});
            });
            // emit by videoList to Popup
            // need to tell popup that we have changed to a youtube video
            // so that header can update its button/form state.
            this.$parent.$emit('changed-video');
        },

        // sends request to content listener to change current video time
        changeTime (newTime) {
            queryCurrentTab((tabs) => {
                if (tabs.length > 0) {
                    chrome.tabs.sendMessage(
                        tabs[0].id, {msg: "change-time", timestamp: newTime}
                    );
                } else {
                    this.changeVideo(newTime);
                }
            }, "https://www.youtube.com/watch?v=" + this.videoIdProp + "*");
        },
        // converts from seconds to HH:MM:SS
        // https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
        convertTimeFormat(seconds) {
            let dateObj = new Date(0);
            dateObj.setSeconds(seconds);
            return dateObj.toISOString().substr(11, 8);
        }
    }
}
</script>


<style scoped>
.videoTitle {
    font-size: 15px;
}
.videoTimestamp {
    font-size: 12px;
}
.remove-timestamp-btn {
    height: 30px;
    width: 100px;
    background-color: red;
}
</style>
