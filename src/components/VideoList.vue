<template>
    <div class="accordion" id="videos-list">
        <VideoItem
            v-for="(videoMeta, videoId) in videos" :key="videoId"
            :videoMeta="videoMeta" :videoId="videoId"
        />
    </div>
</template>

<script>
import {mapState} from 'vuex';
import VideoItem from "./VideoItem.vue";

export default {
    computed: {
        // mapState is module namespaced despite namespace flag being false
        ...mapState({
            videos: state => state.videosStore.videos
        })
    },
    components: {VideoItem},
}
</script>

<style scoped>
</style>
