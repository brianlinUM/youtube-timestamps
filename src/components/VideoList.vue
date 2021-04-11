<template>
    <div class="accordion" id="videos-list">
        <VideoItem
            v-for="(meta, videoId) in videosProp" :key="videoId"
            :metaProp="meta" :videoIdProp="videoId"
        />
    </div>
</template>

<script>
import VideoItem from "./VideoItem.vue";

export default {
    props: ["videosProp"],
    components: {VideoItem},
}
</script>

<style scoped>
</style>
