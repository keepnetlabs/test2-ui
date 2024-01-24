<template>
  <AppDialog
    title-id="text--campaign-manager-launch-campaign-popup-title"
    subtitle-id="text--campaign-manager-launch-campaign-popup-subtitle"
    :icon="CONSTANTS.icon"
    :title="CONSTANTS.title"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body> {{ CONSTANTS.content }} </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--campaign-manager-launch-campaign-popup"
        confirm-button-id="btn-confirm--campaign-manager-launch-campaign-popup"
        :confirm-button-disabled="isActionButtonDisabled"
        action-button-text="LAUNCH"
        @handleClose="handleClose"
        @handleConfirm="handleConfirm"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog.vue'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'

export default {
  name: 'CommonCampaignManagerLaunchCampaignDialog',
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
        icon: 'mdi-send',
        title: 'Launch The Campaign',
        content: 'Do you want to launch this campaign?'
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
