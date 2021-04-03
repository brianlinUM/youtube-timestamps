<template>
    <div id="videos-list">
        <ul>
            <li v-for="(meta, videoId) in videosProp" :key="videoId">
                <VideoMeta :metaProp="meta" :videoIdProp="videoId"/>
            </li>
        </ul>
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
