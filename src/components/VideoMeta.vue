<template>
    <div>
        <a href="#" @click="changeVideo(0)"><h1 class="videoTitle">{{metaProp.title}}</h1></a>
        <!-- emit event to grandparent as it handles the data -->
        <button type="button" class="remove-timestamp-btn"
            @click="$parent.$emit('remove-video', {
                        videoId: videoIdProp
            })"
        >
            Remove Video
        </button>
        <ul>
            <li v-for="timestamp in metaProp.timestamps" :key="timestamp">
                <a class="videoTimestamp" href="#" @click="changeTime(timestamp)">{{timestamp}}</a>
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
</template>


<script>
export default {
    props: ["metaProp", "videoIdProp"],
    emits: ['remove-timestamp', 'remove-video'],
    methods: {
        // sends request to content listener to change current video time
        changeTime (newTime) {
            chrome.tabs.query(
                {
                    active: true, currentWindow: true,
                    url: "https://www.youtube.com/watch?v=" + this.videoIdProp + "*",
                }, (tabs) => {
                    if (tabs.length > 0) {
                        chrome.tabs.sendMessage(
                            tabs[0].id, {msg: "change-time", timestamp: newTime}
                        );
                    } else {
                        this.changeVideo(newTime);
                    }
                }
            );
        },
        // change current tab to new YouTube Video
        changeVideo(newTime) {
            const newUrl = "https://www.youtube.com/watch?v=" + this.videoIdProp + "&t=" + newTime;
            chrome.tabs.query(
                {
                    active: true, currentWindow: true,
                }, (tabs) => {
                    chrome.tabs.update(tabs[0].id, {url: newUrl});
                }
            );
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