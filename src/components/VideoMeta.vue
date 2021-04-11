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
                        <nav class="navbar navbar-light bg-light">
                            <div class="container-fluid">
                                <button type="button" @click="changeVideo(0)" class="btn btn-success">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-btn" viewBox="0 0 16 16">
                                        <path d="M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"/>
                                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                                    </svg>
                                </button>

                                <!-- emit event to grandparent as it handles the data -->
                                <button type="button" class="btn btn-danger"
                                    @click="$parent.$emit('remove-video', {
                                        videoId: videoIdProp
                                    })"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                    </svg>
                                </button>
                            </div>
                        </nav>
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
import queryCurrentTab from "../common/obtainCurrentTab.js";

export default {
    props: ["metaProp", "videoIdProp"],
    emits: ['remove-timestamp', 'remove-video'],
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
        // change current tab to new YouTube Video
        changeVideo(newTime) {
            const newUrl = "https://www.youtube.com/watch?v=" + this.videoIdProp + "&t=" + newTime;
            queryCurrentTab((tabs) => {
                chrome.tabs.update(tabs[0].id, {url: newUrl});
            });
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
