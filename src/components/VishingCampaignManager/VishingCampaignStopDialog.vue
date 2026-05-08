<template>
  <AppDialog
    :status="status"
    icon="mdi-alert"
    title="Stop Vishing Campaign"
    subtitle="Do you want to stop this vishing campaign?"
    body="Once stopped, you cannot resume this vishing campaign"
    @changeStatus="handleClose"
  >
    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--vishing-campaign-stop-popup"
        confirm-button-id="btn-stop--vishing-campaign-stop-popup"
        :confirm-button-disabled="isActionButtonDisabled"
        @handleClose="handleClose"
        @handleConfirm="handleStop"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import { stopVishingCampaign } from '@/api/vishing'

export default {
  name: 'VishingCampaignStopDialog',
  components: { AppDialogFooter, AppDialog },
  props: {
    status: {
      type: Boolean
    },
    selectedRow: {
      type: Object
    }
  },
  data() {
    return {
      isActionButtonDisabled: false
    }
  },
  methods: {
    handleClose(forceUpdate = false) {
      this.$emit('on-cancel', forceUpdate)
    },
    handleStop() {
      this.isActionButtonDisabled = true
      stopVishingCampaign(this.selectedRow.resourceId)
        .then(() => {
          this.handleClose(true)
        })
        .catch(() => {})
        .finally(() => {
          this.isActionButtonDisabled = false
        })
    }
  }
}
</script>
