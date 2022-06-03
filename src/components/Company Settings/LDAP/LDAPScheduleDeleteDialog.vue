<template>
  <AppDialog
    title-id="text--scheduled-sync-delete-popup-title"
    subtitle-id="scheduled-sync-delete-popup-subtitle"
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
        cancel-button-id="btn-cancel--scheduled-sync-popup"
        confirm-button-id="btn-delete-scheduled-sync-popup"
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
import LDAPService from '@/api/ldap'
export default {
  name: 'LDAPScheduleDeleteDialog',
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
        title: 'Delete Scheduled item?',
        subtitle: 'Scheduled item will deleted permanently'
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
      LDAPService.deleteLDAPSchedule(this.selectedRow.resourceId)
        .then(() => {
          this.$emit('on-close-with-update')
        })
        .finally(() => (this.isActionButtonDisabled = false))
    }
  }
}
</script>
