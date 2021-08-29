<template>
    <div class="accordion" id="videos-list">
        <VideoItem
            v-for="video in videos" :key="video[0]"
            :videoMeta="video[1]" :videoId="video[0]"
            :isCurrentVideo="currentVideoId == video[0]"
        />
    </div>
</template>

<script>
import VideoItem from "./VideoItem.vue";
import {mapState} from 'vuex';

export default {
    computed: {
        // format: [[videoId, videoMeta]...]
        videos () {
            return this.$store.getters.filteredVideos;
        },
        ...mapState({
            currentVideoId: state => state.videosStore.currentVideoId
        }),
    },
    components: {VideoItem},
}
</script>

<style scoped>
</style>
