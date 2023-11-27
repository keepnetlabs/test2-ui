<template>
  <AppDialog
    icon="mdi-alert"
    title="You do not have any target user groups"
    title-id="text--no-target-user-group-popup-title"
    :status="status"
    @changeStatus="closeModal"
  >
    <template #app-dialog-body>
      You need a target group to receieve a smishing campaign. Please create a target group to
      start.
    </template>
    <template #app-dialog-footer>
      <app-dialog-footer
        justify="space-between"
        cancel-button-id="btn-cancel--no-target-user-group-popup"
        confirm-button-id="btn-confirm--no-target-user-group-popup"
        actionButtonText="Create target group"
        @handleClose="closeModal"
        @handleConfirm="handleConfirm"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
export default {
  name: 'NoTargetUserGroupModal',
  components: {
    AppDialog,
    AppDialogFooter
  },
  props: {
    status: {
      type: Boolean
    }
  },
  methods: {
    closeModal() {
      this.$emit('on-close')
    },
    handleConfirm() {
      this.$emit('on-confirm')
    }
  }
}
</script>
