<template>
    <div class="accordion" id="videos-list">
        <VideoItem
            v-for="video in videos" :key="video[0]"
            :videoMeta="video[1]" :videoId="video[0]"
        />
    </div>
</template>

<script>
import VideoItem from "./VideoItem.vue";

export default {
    computed: {
        // format: [[videoId, videoMeta]...]
        videos () {
            return this.$store.getters.filteredVideos;
        }
    },
    components: {VideoItem},
}
</script>

<style scoped>
</style>
