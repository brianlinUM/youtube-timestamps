<template>
  <div class="card" style="width: 18rem;">
    <div class="card-header">
      Unsafe Functions
    </div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item">
        <button
          type="button" :class="`btn btn-sm ml-3 ${deleteColor}`"
          @click="removeAllDataSynced" :disabled="isNoVideos"
        >
          {{ deleteText }}
        </button>
      </li>
      <li class="list-group-item">Test 2</li>
      <li class="list-group-item">Test 3</li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState({
      videos: (state) => state.videosStore.videos,
    }),
    isNoVideos() {
      return Object.keys(this.videos).length === 0;
    },
    deleteText() {
      return this.isNoVideos ? 'No Videos' : 'Delete All';
    },
    deleteColor() {
      return this.isNoVideos ? 'btn-secondary' : 'btn-danger';
    },
  },
  methods: {
    ...mapActions(['removeAllDataSynced']),
  },
};
</script>
