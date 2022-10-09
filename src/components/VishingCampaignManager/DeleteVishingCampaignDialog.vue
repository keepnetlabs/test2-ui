<template>
  <AppDialog
    icon="mdi-delete"
    title="Delete Vishing Campaign?"
    title-id="text--vishing-campaign-delete-popup-title"
    subtitle-id="text--vishing-campaign-delete-popup-subtitle"
    :status="status"
    @changeStatus="closeModal"
  >
    <template v-slot:app-dialog-body>
      {{ selectedRow && selectedRow.name }} will be deleted.
    </template>
    <template v-slot:app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--vishing-campaign-popup"
        confirm-button-id="btn-delete--vishing-campaign-popup"
        type="delete"
        @handleClose="closeModal"
        @handleConfirm="handleDelete"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
export default {
  name: 'DeleteVishingCampaignDialog',
  components: {
    AppDialog,
    AppDialogFooter
  },
  emits: ['onCancel', 'onConfirm'],
  props: {
    status: {
      type: Boolean
    },
    selectedRow: {
      type: Object
    }
  },
  methods: {
    closeModal() {
      this.$emit('onCancel')
    },
    handleDelete() {
      this.$emit('onConfirm')
    }
  }
}
</script>
