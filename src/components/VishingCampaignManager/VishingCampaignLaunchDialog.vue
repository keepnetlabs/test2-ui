<template>
  <AppDialog
    icon="mdi-alert"
    :status="status"
    title="Launch Vishing Campaign"
    body="Do you want to launch this vishing campaign?"
    @changeStatus="handleClose"
  >
    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--vishing-campaign-launch-popup"
        confirm-button-id="btn-stop--vishing-campaign-launch-popup"
        :confirm-button-disabled="isActionButtonDisabled"
        @handleClose="handleClose"
        @handleConfirm="handleStop"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { launchVishingCampaign } from '@/api/vishing'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter.vue'

export default {
  name: 'VishingCampaignLaunchDialog',
  components: { AppDialog, AppDialogFooter },
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
      launchVishingCampaign(this.selectedRow.resourceId)
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
