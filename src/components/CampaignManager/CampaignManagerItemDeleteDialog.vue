<template>
  <AppDialog
    title-id="text--campaign-manager-item-delete-popup-title"
    subtitle-id="text--campaign-manager-item-delete-popup-subtitle"
    :icon="CONSTANTS.icon"
    :title="CONSTANTS.title"
    :subtitle="CONSTANTS.subtitle"
    :status="status"
    @changeStatus="closeModal"
  >
    <template #app-dialog-body> Instance will be deleted. </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        type="delete"
        cancel-button-id="btn-cancel--campaign-manager-popup"
        confirm-button-id="btn-delete--campaign-manager-popup"
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
export default {
  name: 'CampaignManagerItemDeleteDialog',
  components: { AppDialogFooter, AppDialog },
  props: {
    status: {
      type: Boolean
    },
    item: {
      type: Object
    },
    isActionButtonDisabled: {
      type: Boolean
    }
  },
  data() {
    return {
      CONSTANTS: {
        icon: 'mdi-delete',
        title: 'Delete Campaign Instance?',
        subtitle: 'Instance will deleted permanently'
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('on-close')
    },
    handleDelete() {
      this.$emit('on-delete', this.item.resourceId)
    }
  }
}
</script>
