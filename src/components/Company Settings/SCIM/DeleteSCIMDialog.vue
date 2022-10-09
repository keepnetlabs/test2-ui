<template>
  <AppDialog
    type="delete"
    title-id="text--scim-settings-delete-popup-title"
    subtitle-id="text--scim-settings-delete-popup-subtitle"
    :icon="CONSTANTS.icon"
    :title="CONSTANTS.title"
    :subtitle="CONSTANTS.subtitle"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body> {{ selectedRow.name }} will be deleted. </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        type="delete"
        cancel-button-id="btn-cancel--scim-settings-popup"
        confirm-button-id="btn-delete-scim-settings-popup"
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
import { deleteSCIMSetting } from '@/api/scimSettings'
export default {
  name: 'DeleteSCIMDialog',
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
        icon: 'mdi-delete',
        title: 'Delete SCIM Setting?',
        subtitle: 'SCIM Setting will deleted permanently'
      },
      isActionButtonDisabled: false
    }
  },
  methods: {
    handleClose() {
      this.$emit('on-close')
    },
    handleDelete() {
      this.isActionButtonDisabled = true
      deleteSCIMSetting(this.selectedRow.resourceId)
        .then(() => {
          this.handleClose()
          this.$emit('on-close-with-update', this.selectedRow)
        })
        .finally(() => (this.isActionButtonDisabled = false))
    }
  }
}
</script>
