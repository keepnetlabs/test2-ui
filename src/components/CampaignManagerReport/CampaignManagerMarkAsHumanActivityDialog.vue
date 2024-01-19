<template>
  <AppDialog
    title-id="text--campaign-manager-item-delete-popup-title"
    subtitle-id="text--campaign-manager-item-delete-popup-subtitle"
    :icon="CONSTANTS.icon"
    :title="CONSTANTS.title"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <div>
        Do you want to mark this user as a 'Human Activity' by changing the system decision?
      </div>
      <div>This action can be undone.</div>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        type="delete"
        cancel-button-id="btn-cancel--campaign-manager-popup"
        confirm-button-id="btn-delete--campaign-manager-popup"
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
  name: 'CampaignManagerMarkAsHumanActivityDialog',
  components: { AppDialog, AppDialogFooter },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    selectedRow: {
      type: object,
      default: false
    }
  },
  data() {
    return {
      isActionButtonDisabled: false,
      CONSTANTS: {
        icon: 'mdi-account-check',
        title: 'Mark User as Human Activity'
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('on-close')
    },
    handleConfirm() {}
  }
}
</script>
