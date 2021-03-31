<template>
    <div>
        <h1 class="videoTitle">{{metaProp.title}}</h1>
        <ul>
            <li v-for="timestamp in metaProp.timestamps" :key="timestamp">
                <p class="videoTimestamp">{{timestamp}}</p>
                <!-- emit event to grandparent as it handles the data -->
                <button id="video" type="button" class="remove-timestamp-btn"
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
    emits: ['remove-timestamp'],
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