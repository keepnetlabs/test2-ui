<template>
  <AppDialog
    title-id="text--cant-delete-dialog-popup-title"
    subtitle-id="text--cant-delete-dialog-popup-subtitle"
    :icon="CONSTANTS.icon"
    :title="CONSTANTS.title"
    :subtitle="getSubtitle"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      To delete this DNS setting, you must have another DNS setting available. Please define a new
      setting before deleting this one.
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--training-dialog-popup"
        confirm-button-id="btn-delete-training-dialog-popup"
        action-button-text="Create New DNS SERVICE"
        @handleClose="handleClose"
        @handleConfirm="handleClose(true)"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import { EMITS } from '@/components/AwarenessEducator/utils'
export default {
  name: 'CantDeleteDnsServiceDialog',
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
      CONSTANTS: {
        icon: 'mdi-information',
        title: 'You cannot delete this setting'
      },
      isActionButtonDisabled: false
    }
  },
  computed: {
    getSubtitle() {
      return this?.selectedRow?.dnsServiceProviderName
    }
  },
  methods: {
    handleClose(forceUpdate = false) {
      this.$emit(EMITS.ON_CLOSE, forceUpdate)
    }
  }
}
</script>
