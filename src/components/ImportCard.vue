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
      <input ref="fileUpload"
        class="form-control form-control-sm mb-1"
        id="input-import-file" type="file"
        accept="application/json"
        :disabled="!isAllowInput" @change="handleInputChange"
      >
      <button
        type="button" :class="`btn btn-sm btn-primary`"
        :disabled="!isAllowImport"
      >
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: ['isUnsafeEnabled'],
  data() {
    return {
      isFileUploaded: false,
    };
  },
  computed: {
    ...mapState({
      isNoVideos: (state) => Object.keys(state.videosStore.videos).length === 0,
    }),
    isAllowInput() {
      return this.isUnsafeEnabled && this.isNoVideos;
    },
    isAllowImport() {
      return this.isAllowInput && this.isFileUploaded;
    },
    buttonText() {
      if (!this.isNoVideos) return 'Delete all data first';
      if (!this.isFileUploaded) return 'Select file first';

      return 'Import File';
    },
  },
  methods: {
    handleInputChange(event) {
      this.isFileUploaded = event.target.files.length === 1;
    },
  },
  watch: {
    isUnsafeEnabled(newVal) {
      if (!newVal) {
        // clear input
        this.$refs.fileUpload.value = null;
        // need this to trigger reactivity since setting value to null
        // does not count as a change event.
        this.isFileUploaded = false;
      }
    },
  },
};
</script>
