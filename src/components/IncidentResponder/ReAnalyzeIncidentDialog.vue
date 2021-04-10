<template>
  <AppDialog
    icon="mdi-refresh"
    title="Re-analyze Incident"
    :status="status"
    :subtitle="name"
    @changeStatus="closeDialog"
  >
    <template v-slot:app-dialog-body>
      Email will be analyzed again with integrated services
    </template>
    <template v-slot:app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--re-analyze-incident-popup"
        confirm-button-id="btn-delete--re-analyze-incident-popup"
        :confirm-button-disabled="saveDisable"
        @handleClose="closeDialog"
        @handleConfirm="confirm"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import { reAnalyzeEmail } from '@/api/incidentResponder'
export default {
  name: 'ReAnalyzeIncidentDialog',
  components: { AppDialogFooter, AppDialog },
  props: {
    status: {
      type: Boolean
    },
    name: {
      type: String
    },
    resourceId: {
      type: String
    }
  },
  data() {
    return {
      saveDisable: false
    }
  },
  methods: {
    closeDialog() {
      this.$emit('on-close-dialog')
    },
    confirm() {
      this.saveDisable = true
      reAnalyzeEmail(this.resourceId)
        .then((response) => {
          this.$emit('on-confirm')
        })
        .finally(() => {
          this.closeDialog()
          this.saveDisable = false
        })
    }
  }
}
</script>
