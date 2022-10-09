<template>
  <AppDialog
    type="delete"
    icon="mdi-delete"
    :title="getTitle"
    title-id="text--vishing-campaign-delete-popup-title"
    subtitle-id="text--vishing-campaign-delete-popup-subtitle"
    :status="status"
    @changeStatus="closeModal"
  >
    <template v-slot:app-dialog-body>
      {{ getContent }}
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
    },
    selectedRowCount: {
      type: Number,
      default: 0
    },
    isMultiple: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    getTitle() {
      return this.isMultiple
        ? `Delete ${this.selectedRowCount} ${this.selectedRowCount > 1 ? 'campaigns' : 'campaign'}?`
        : 'Delete Vishing Campaign?'
    },
    getContent() {
      return this.isMultiple
        ? `Are you sure you want to delete all ${this.selectedRowCount} of the selected ${
            this.selectedRowCount > 1 ? 'campaigns' : 'campaign'
          }?`
        : `${this.selectedRow && this.selectedRow.name} will be deleted.`
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
