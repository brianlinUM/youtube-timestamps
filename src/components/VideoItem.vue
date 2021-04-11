<template>
    <div class="accordion-item">
        <div class="accordion-header">
            <h2 class="videoTitle m-0">
                <button
                    class="accordion-button shadow-none collapsed" type="button"
                    data-bs-toggle="collapse" :data-bs-target="'#body'+videoIdProp"
                    title="Toggle Video"
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
                        class="list-group-item p-2"
                    >
                        <TimestampItem
                            :timestamp="timestamp" :label="label" :videoId="videoIdProp"
                            @remove-timestamp="removeTimestamp"
                            @change-video-and-time="changeVideoAndTime"
                            @update-timestamp-label="updateTimestampLabel"
                        />
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>


<script>
import VideoNav from "./VideoNav.vue";
import TimestampItem from "./TimestampItem.vue";
import queryCurrentTab from "../common/obtainCurrentTab.js";

export default {
    props: ["metaProp", "videoIdProp"],
    components: {VideoNav, TimestampItem},
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
        // Called when a timestamp is clicked and current tab
        // is not the matching video.
        changeVideoAndTime(newTimeMsg) {
            const {newTime} = newTimeMsg;
            this.changeVideo(newTime);
        },
        // Relay timestamp removal event
        removeTimestamp(timestampData) {
            // emit event to grandparent as it handles the data
            this.$parent.$emit('remove-timestamp', timestampData);
        },
        // Relay timestamp label update event
        updateTimestampLabel(timestampData) {
            this.$parent.$emit('update-timestamp-label', timestampData);
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
</style>
