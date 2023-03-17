<template>
  <AppDialog
    type="delete"
    title-id="text--direct-email-creation-dialog-delete-popup-title"
    subtitle-id="text--direct-email-creation-dialog-delete-popup-subtitle"
    :icon="CONSTANTS.icon"
    :title="CONSTANTS.title"
    :subtitle="getSubtitle"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      This setting will be deleted permanently. Are you sure to delete it?
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        type="delete"
        cancel-button-id="btn-cancel--direct-email-creation-dialog-popup"
        confirm-button-id="btn-delete-direct-email-creation-dialog-popup"
        :confirm-button-disabled="isActionButtonDisabled"
        @handleClose="handleClose"
        @handleConfirm="handleDelete"
      />
    </template>
  </AppDialog>
</template>
<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import { EMITS } from './utils'
import DirectCreationService from '@/api/direct-creation'

export default {
  name: 'DeleteDirectEmailCreationDialog',
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
      CONSTANTS: {
        icon: 'mdi-delete',
        title: 'Delete This Setting?'
      },
      isActionButtonDisabled: false
    }
  },
  computed: {
    getSubtitle() {
      return this?.selectedRow?.name || ''
    }
  },
  methods: {
    handleClose(forceUpdate = false) {
      this.$emit(EMITS.ON_CLOSE, forceUpdate)
    },
    handleDelete() {
      this.isActionButtonDisabled = true
      DirectCreationService.deleteEmailCreation(this.selectedRow.resourceId)
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
