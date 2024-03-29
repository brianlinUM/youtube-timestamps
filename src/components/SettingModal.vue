<template>
  <div class="modal fade" id="setting-modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div id="about-modal-header" class="modal-header py-2">
          <h5 class="modal-title">
            Settings
          </h5>
        </div>
        <div class="modal-body py-2">
          <ExportCard/>
          <UnsafeSettingsCard/>
        </div>
        <div class="modal-footer py-2">
          <button
            type="button" class="btn btn-sm btn-secondary me-3" data-bs-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#about-modal-header {
  background-color: #717a83;
}
</style>

<script>
import ExportCard from './ExportCard.vue';
import UnsafeSettingsCard from './UnsafeSettingsCard.vue';

export default {
  components: { ExportCard, UnsafeSettingsCard },
};
</script>
