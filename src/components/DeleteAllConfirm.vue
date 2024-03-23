<template>
  <div>
    <p>
      Delete all videos and timestamps.
    </p>
    <p>
      Warning: data loss is permanent.
      Type "Delete All" to confirm:
    </p>
    <div class="input-group input-group-sm">
      <input
        type="text" class="form-control" id="input-delete-all-confirm"
        v-model="confirmText" title="Type confirmation"
        :disabled="this.isNoVideos || !this.isUnsafeEnabled"
      >

      <button
        type="button" :class="`btn btn-sm ${deleteColor}`"
        :disabled="!this.isAllowDelete" @click="removeAll"
        :title="tooltipText"
      >
      {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<style scoped>
button {
  width: 50%;
}
</style>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  props: ['isUnsafeEnabled'],
  data() {
    return {
      confirmText: '',
    };
  },
  computed: {
    ...mapState({
      videos: (state) => state.videosStore.videos,
    }),
    isNoVideos() {
      return Object.keys(this.videos).length === 0;
    },
    isTextMatch() {
      return this.confirmText.toLowerCase() === 'delete all';
    },
    isAllowDelete() {
      return !this.isNoVideos && this.isTextMatch && this.isUnsafeEnabled;
    },
    buttonText() {
      if (this.isNoVideos) {
        return 'No Videos';
      }

      return this.isTextMatch ? 'Confirm' : 'Not Matching';
    },
    deleteColor() {
      return this.isAllowDelete ? 'btn-danger' : 'btn-secondary';
    },
    tooltipText() {
      return this.isAllowDelete ? 'Confirm Deletion' : '';
    },
  },
  methods: {
    ...mapActions(['removeAllDataSynced']),
    removeAll() {
      // final safeguard
      if (this.isAllowDelete) {
        this.confirmText = '';
        this.removeAllDataSynced();
      }
    },
  },
};
</script>
