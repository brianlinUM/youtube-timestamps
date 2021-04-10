<template>
    <div class="accordion" id="videos-list">
        <VideoMeta
            v-for="(meta, videoId) in videosProp" :key="videoId"
            :metaProp="meta" :videoIdProp="videoId"
        />
    </div>
</template>

<script>
import VideoMeta from "./VideoMeta.vue";

export default {
    props: ["videosProp"],
    components: {VideoMeta},
}
</script>

<style scoped>
</style>
