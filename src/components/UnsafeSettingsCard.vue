<template>
  <div class="card" style="width: 100%">
    <div class="card-header d-flex flex-row justify-content-between">
      <span>Unsafe Functions</span>
      <button id="unsafeToggle" type="button" class="btn btn-sm btn-primary"
        data-bs-toggle="collapse" data-bs-target="#unsafe-options"
        @click="isUnsafeEnabled = !isUnsafeEnabled">
        {{ this.isUnsafeEnabled ? 'Hide' : 'Show' }}
      </button>
    </div>
    <ul id="unsafe-options" class="list-group list-group-flush collapse">
      <li class="list-group-item">
        <button
          type="button" :class="`btn btn-sm ml-3 ${deleteColor}`"
          @click="removeAllDataSynced" :disabled="isNoVideos || !isUnsafeEnabled"
        >
          {{ deleteText }}
        </button>
      </li>
      <li class="list-group-item">Test 2</li>
      <li class="list-group-item">Test 3</li>
    </ul>
  </div>
</template>

<style scoped>
#unsafeToggle {
  width: 25%;
}
</style>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      isUnsafeEnabled: false,
    };
  },
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
