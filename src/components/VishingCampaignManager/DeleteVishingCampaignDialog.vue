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
    <template #app-dialog-body>
      {{ getContent }}
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--vishing-campaign-popup"
        confirm-button-id="btn-delete--vishing-campaign-popup"
        type="delete"
        :confirm-button-disabled="isActionButtonDisabled"
        @handleClose="closeModal"
        @handleConfirm="handleDelete"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import { deleteVishingCampaign } from '@/api/vishing'
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
  data() {
    return {
      isActionButtonDisabled: false
    }
  },
  computed: {
    getTitle() {
      return this.isMultiple
        ? `Delete ${this.selectedRowCount} ${this.campaignText}?`
        : 'Delete Vishing Campaign?'
    },
    getContent() {
      return this.isMultiple
        ? `Are you sure you want to delete all ${this.selectedRowCount} of the selected ${this.campaignText}?`
        : `${this.selectedRow && this.selectedRow.name} will be deleted.`
    },
    campaignText() {
      return this.selectedRowCount > 1 ? 'campaigns' : 'campaign'
    }
  },
  methods: {
    closeModal(forceUpdate = false) {
      this.$emit('onCancel', forceUpdate)
    },
    handleDelete() {
      this.isActionButtonDisabled = true
      deleteVishingCampaign(this.selectedRow.resourceId)
        .then(() => {
          this.closeModal(true)
        })
        .catch(() => {})
        .finally(() => {
          this.isActionButtonDisabled = false
        })
    }
  }
}
</script>
