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
                        <VideoNav :videoIdProp="videoIdProp"/>
                    </li>
                    <li
                        v-for="(label, timestamp) in metaProp.timestamps" :key="timestamp"
                        class="list-group-item"
                    >
                        <a class="videoTimestamp" href="#" @click="changeTime(timestamp)">{{timestamp}}</a>
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
