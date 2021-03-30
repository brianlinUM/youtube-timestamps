<template>
    <div id="popup">
        <button 
            type="button" id="add-timestamp-btn" v-show="isYoutubeVideoTab" 
            @click="sendTimestampRequest"
        >
                Add Timestamp
        </button>
        <button
            type="button" id="remove-all-btn" @click="clearAllTimestamps"
        >
            Clear All Timestamps
        </button>
        <ul>
            <li v-for="timestamp in timestamps" :key="timestamp">{{timestamp[0]}}: {{timestamp[1]}}</li>
        </ul>
    </div>
</template>


<script>
export default {
    data () {
        return {
            timestamps: [],
            isYoutubeVideoTab: false,
        }
    },

    created () {
        // check if the active tab is a youtube video and hide
        // add timestamp btn if not.
        chrome.tabs.query(
            {
                active: true, currentWindow: true,
                url: "https://www.youtube.com/watch?v=*",
            }, (tabs) => {
                this.isYoutubeVideoTab = tabs.length > 0;
            }
        );
        chrome.storage.local.get("timestamps", (data) => {
            this.timestamps = data.timestamps ? data.timestamps : [];
        });
    },

    methods: {
        // Send a request to the active youtube page to retrieve its timestamp.
        // https://developer.chrome.com/docs/extensions/mv2/messaging/
        sendTimestampRequest () {
            // No need to check if is Youtube video tab since btn only appears if it is
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                chrome.tabs.sendMessage(
                    tabs[0].id, {msg: "add-timestamp"}, (response) => {
                        this.addTimestamp(response);
                    }
                );
            });
        },
        // add timestamp to popup instance and then to local storage
        addTimestamp(timestampData) {
            this.timestamps.push([timestampData.videoId, timestampData.timestamp]);
            chrome.storage.local.set(
                {
                    timestamps: this.timestamps
                }
            );
        },
        // remove all timestamps from popup instance then from local storage
        clearAllTimestamps() {
            this.timestamps = [];
            chrome.storage.local.clear();
        },
    },
}
</script>


<style scoped>
button {
    height: 30px;
    width: 200px;
}

#add-timestamp-btn {
    background-color: aqua;
}

#remove-all-btn {
    background-color: red;
}
</style>
