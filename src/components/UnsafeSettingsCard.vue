<template>
  <div class="card border-warning" style="width: 100%">
    <div class="card-header bg-warning
      d-flex flex-row justify-content-between"
    >
      <span class="align-middle">
        <!-- Warning icon -->
        <!-- eslint-disable max-len -->
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle" viewBox="0 0 16 16">
          <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z"/>
          <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
        </svg>

        Unsafe Functions
      </span>
      <button id="unsafeToggle" type="button" class="btn btn-sm btn-danger"
        data-bs-toggle="collapse" data-bs-target="#unsafe-options"
        @click="isUnsafeEnabled = !isUnsafeEnabled"
      >
        {{ this.isUnsafeEnabled ? 'Disable' : 'Enable' }}
      </button>
    </div>
    <ul id="unsafe-options"
      class="list-group list-group-flush collapse"
    >
      <li class="list-group-item">
        <DeleteAllConfirm :isUnsafeEnabled="isUnsafeEnabled"/>
      </li>
      <li class="list-group-item">
        <ImportCard :isUnsafeEnabled="isUnsafeEnabled"/>
      </li>
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
import DeleteAllConfirm from './DeleteAllConfirm.vue';
import ImportCard from './ImportCard.vue';

export default {
  components: { DeleteAllConfirm, ImportCard },
  data() {
    return {
      isUnsafeEnabled: false,
    };
  },
};
</script>
