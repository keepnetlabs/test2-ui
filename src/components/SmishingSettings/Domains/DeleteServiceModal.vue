<template>
  <app-dialog
    type="delete"
    icon="mdi-delete"
    title="Delete Domain?"
    subtitle="The Domain will deleted permanently"
    title-id="text--dns-delete-popup-title"
    subtitle-id="text--dns-delete-popup-subtitle"
    :status="status"
    @changeStatus="closeModal"
  >
    <template v-slot:app-dialog-body>
      {{ selectedDomain && selectedDomain.domain }} will be deleted and removed from domains.
    </template>
    <template v-slot:app-dialog-footer>
      <app-dialog-footer
        cancel-button-id="btn-cancel--domains-popup"
        confirm-button-id="btn-delete--domains-popup"
        type="delete"
        @handleClose="closeModal"
        @handleConfirm="handleDelete"
      />
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
export default {
  name: 'DeleteIntegration',
  components: {
    AppDialog,
    AppDialogFooter
  },
  props: {
    status: {
      type: Boolean
    },
    selectedIntegration: {},
    selectedDomain: null
  },
  methods: {
    closeModal() {
      this.$emit('handleCloseModal')
    },
    handleDelete() {
      this.$emit('handleDelete', this.selectedDomain)
      this.closeModal()
    }
  }
}
</script>
