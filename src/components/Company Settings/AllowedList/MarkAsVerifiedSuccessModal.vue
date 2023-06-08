<template>
  <div v-if="status">
    <app-dialog
      icon="mdi-check"
      title="Domain verified"
      :subtitle="selectedDomain.domain"
      title-id="text--domain-mark-as-verified-success-popup-title"
      subtitle-id="text--domain-mark-as-verified-success-popup-subtitle"
      :status="status"
      @changeStatus="closeModal"
    >
      <template v-slot:app-dialog-body>
        <div class="domain-mark-as-verified-success-text-container">
          <div class="delete-title">This domain has been marked as verified.</div>
        </div>
      </template>
      <template v-slot:app-dialog-footer>
        <div class="d-flex" style="justify-content: flex-end;">
          <v-btn class="pa-0 k-dialog__button" text color="#2196f3" @click="closeModal"
            >CLOSE
          </v-btn>
        </div>
      </template>
    </app-dialog>
  </div>
</template>

<script>
import AppDialog from '@/components/AppDialog'
export default {
  name: 'MarkAsVerifiedModal',
  components: {
    AppDialog
  },
  props: {
    status: {
      type: Boolean
    },
    selectedDomain: {
      type: Object
    }
  },
  methods: {
    closeModal() {
      this.$emit('handleCloseModal')
    }
  }
}
</script>
