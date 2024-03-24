<template>
  <div>
    <p style="font-weight: bold">
      Import from JSON
    </p>
    <p>
      Warning: this overwrites the existing data.
      As a precaution, there needs to be no existing data in the app.
      If the button is disabled, check that the JSON is valid.
    </p>
    <div>
      <input ref="fileUpload"
        class="form-control form-control-sm mb-1"
        id="input-import-file" type="file"
        accept="application/json"
        :disabled="!isAllowInput" @change="handleInputChange"
      >
      <button
        type="button" :class="`btn btn-sm ${buttonColor}`"
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
      input_obj: {},
      isShowInvalidText: false,
    };
  },
  computed: {
    ...mapState({
      isNoVideos: (state) => Object.keys(state.videosStore.videos).length === 0,
    }),
    isAllowInput() {
      return this.isUnsafeEnabled && this.isNoVideos;
    },
    isValidFileUploaded() {
      return Object.keys(this.input_obj).length > 0;
    },
    isAllowImport() {
      return this.isAllowInput && this.isValidFileUploaded;
    },
    buttonText() {
      // invalid condition is first to let it have priority
      if (this.isShowInvalidText) return 'Invalid JSON';
      if (!this.isNoVideos) return 'Delete all data first';
      if (!this.isValidFileUploaded) return 'Select valid JSON first';

      return 'Attempt import';
    },
    buttonColor() {
      return this.isAllowImport ? 'btn-primary' : 'btn-secondary';
    },
  },
  methods: {
    handleInputChange(event) {
      this.isShowInvalidText = false; // reset
      this.parseInputFile(event.target.files[0]);
    },
    parseInputFile(file) {
      const reader = new FileReader();
      reader.onload = this.onReaderLoad;
      reader.readAsText(file);
    },
    onReaderLoad(event) {
      try {
        const obj = JSON.parse(event.target.result);
        this.input_obj = obj;
      } catch (e) {
        this.isShowInvalidText = true;
        setTimeout(() => { this.isShowInvalidText = false; }, 2000);
        this.resetInput();
      }
    },
    resetInput() {
      // clear input
      this.$refs.fileUpload.value = null;
      // need this to trigger reactivity since setting value to null
      // does not count as a change event.
      this.input_obj = {};
    },
  },
  watch: {
    isUnsafeEnabled(newVal) {
      if (!newVal) {
        this.resetInput();
      }
    },
  },
};
</script>
