<template>
  <div>
    <p style="font-weight: bold">
      Import from JSON
    </p>
    <p>
      Warning: this overwrites the existing data.
      As a precaution, there needs to be no existing data in the app.
    </p>
    <div class="">
      <input class="form-control form-control-sm mb-1" id="input-import-file" type="file">
      <button
        type="button" :class="`btn btn-sm btn-primary`"
        :disabled="!this.allowImport"
      >
        Import File
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: ['isUnsafeEnabled'],
  computed: {
    ...mapState({
      isNoVideos: (state) => Object.keys(state.videosStore.videos).length === 0,
    }),
    allowImport() {
      return this.isUnsafeEnabled && this.isNoVideos;
    },
  },
};
</script>
