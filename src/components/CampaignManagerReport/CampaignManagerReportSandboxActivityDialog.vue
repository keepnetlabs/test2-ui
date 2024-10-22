<template>
  <AppDialog
    title-id="text--campaign-manager-item-delete-popup-title"
    subtitle-id="text--campaign-manager-item-delete-popup-subtitle"
    icon="mdi-account-cancel"
    title="Mark User as Bot Activity"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <div>
        <div>
          Do you want to mark this user as a 'Bot Activity' by taking back the system decision?
        </div>
        <div>This action can be undone.</div>
      </div>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
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
import AppDialog from '@/components/AppDialog.vue'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter.vue'
import { updateSandboxActivity } from '@/api/phishingsimulator'

export default {
  name: 'CampaignManagerReportSandboxActivityDialog',
  components: { AppDialogFooter, AppDialog },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    selectedRow: {
      type: Object,
      default: null
    },
    searchType: {
      type: String,
      default: 'opened'
    }
  },
  data() {
    return {
      isActionButtonDisabled: false
    }
  },
  methods: {
    handleClose(forceUpdate = false) {
      this.$emit('on-close', null, forceUpdate)
    },
    handleConfirm() {
      this.isActionButtonDisabled = true
      updateSandboxActivity(this.selectedRow.resourceId, {
        searchType: this.searchType,
        activityType: 1
      })
        .then(() => {
          this.handleClose(true)
        })
        .finally(() => {
          this.isActionButtonDisabled = false
        })
    }
  }
}
</script>
