<template>
  <AppDialog
    title-id="text--target-user-create-user-with-group-title"
    subtitle-id="text--target-user-create-user-with-group-subtitle"
    title="Create New Group with user"
    subtitle="Give a name to your new group and save"
    icon="mdi-account-multiple"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <InputEntityName
        v-model.trim="groupName"
        initial-placeholder="Enter name"
        :required="false"
      />
    </template>
    <template #app-dialog-footer>
      <app-dialog-footer
        cancel-button-id="btn-cancel--target-user-create-user-with-group-popup"
        confirm-button-id="btn-confirm--target-user-create-user-with-group-popup"
        actionButtonText="CREATE"
        :confirm-button-disabled="confirmButtonDisabled"
        @handleClose="handleClose"
        @handleConfirm="handleConfirm"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'

export default {
  name: 'TargetUserCreateGroupWithUserDialog',
  components: { AppDialog, AppDialogFooter, InputEntityName },
  props: {
    status: {
      type: Boolean
    }
  },
  data() {
    return {
      CONSTANTS: {
        icon: 'mdi-account-multiple-plus'
      },
      confirmButtonDisabled: true,
      groupName: ''
    }
  },
  watch: {
    groupName(val) {
      if (val) {
        this.confirmButtonDisabled = false
      } else {
        this.confirmButtonDisabled = true
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('onClose')
    },
    handleConfirm() {
      this.$emit('onConfirm')
    }
  }
}
</script>
