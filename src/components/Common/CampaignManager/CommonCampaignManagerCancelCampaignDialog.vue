<template>
  <AppDialog
    type="delete"
    title-id="text--campaign-manager-delete-popup-title"
    subtitle-id="text--campaign-manager-delete-popup-subtitle"
    :icon="CONSTANTS.icon"
    :title="CONSTANTS.title"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body> {{ CONSTANTS.content }} </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        type="delete"
        is-force-action-button-text
        cancel-button-id="btn-cancel--campaign-manager-popup"
        confirm-button-id="btn-delete--campaign-manager-popup"
        :confirm-button-disabled="isActionButtonDisabled"
        cancel-button-text="NOT NOW"
        action-button-text="CANCEL CAMPAIGN"
        @handleClose="handleClose"
        @handleConfirm="handleConfirm"
      />
    </template>
  </AppDialog>
</template>
<script>
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import AppDialog from '@/components/AppDialog'

export default {
  name: 'CommonCampaignManagerCancelCampaignDialog',
  components: { AppDialog, AppDialogFooter },
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
        icon: 'mdi-close',
        title: 'Cancel The Campaign',
        content: 'Do you want to cancel this campaign?'
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('on-close')
    },
    handleConfirm() {
      this.$emit('on-confirm', this.item)
    }
  }
}
</script>
