<template>
  <AppDialog
    title-id="text--campaign-manager-create-new-instance-popup-title"
    subtitle-id="text--campaign-manager-create-new-instance-delete-popup-subtitle"
    :icon="CONSTANTS.icon"
    :title="CONSTANTS.title"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body> {{ CONSTANTS.content }} </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--campaign-manager-create-new-instance-popup"
        confirm-button-id="btn-confirm--campaign-manager-create-new-instance-popup"
        :confirm-button-disabled="isActionButtonDisabled"
        @handleClose="handleClose"
        @handleConfirm="handleConfirm"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter.vue'
import AppDialog from '@/components/AppDialog.vue'

export default {
  name: 'CommonCampaignManagerCreateNewInstanceDialog',
  components: { AppDialog, AppDialogFooter },
  props: {
    status: {
      type: Boolean
    },
    resourceId: {
      type: String
    }
  },
  data() {
    return {
      isActionButtonDisabled: false,
      isMultipleDelete: false,
      multipleDeletedUserCount: 0,
      CONSTANTS: {
        icon: '$custom-new-instance',
        title: 'Create New Run',
        content: 'Do you want to create a new run?'
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('on-close')
    },
    handleConfirm() {
      this.$emit('on-confirm', this.resourceId)
    }
  }
}
</script>
