<template>
  <div v-if="status">
    <app-dialog
      icon="mdi-check-circle"
      title="Domain verified"
      :subtitle="selectedDomain"
      title-id="text--domain-verified-popup-title"
      subtitle-id="text--domain-verified-popup-subtitle"
      :status="status"
      @changeStatus="closeModal"
    >
      <template #app-dialog-body>
        <div class="domain-verified-text-container">
          This domain has been verified.
        </div>
      </template>
      <template #app-dialog-footer>
        <div @click="closeModal" class="domain-verified-close-btn">CLOSE</div>
      </template>
    </app-dialog>
  </div>
</template>

<script>
import AppDialog from '../../AppDialog'
export default {
  name: 'DomainVerified',
  components: {
    AppDialog
  },
  props: {
    status: {
      type: Boolean
    },
    selectedDomain: {
      type: String
    }
  },
  data() {
    return {
      confirmText: '',
      buttonDisableStatus: true
    }
  },
  methods: {
    closeModal() {
      this.$emit('handleCloseModal')
      this.confirmText = ''
    }
  }
}
</script>
