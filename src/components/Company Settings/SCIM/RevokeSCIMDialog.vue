<template>
  <AppDialog
    title-id="text--scim-settings-revoke-popup-title"
    subtitle-id="text--scim-settings-revoke-popup-subtitle"
    :icon="CONSTANTS.icon"
    :title="CONSTANTS.title"
    :subtitle="CONSTANTS.subtitle"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body> Instance will be revoked. </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--scim-settings-revoke-popup"
        confirm-button-id="btn-revoke-scim-settings-revoke-popup"
        :confirm-button-disabled="isActionButtonDisabled"
        @handleClose="handleClose"
        @handleConfirm="handleRevoke"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import { revokeSCIMSetting } from '@/api/scimSettings'
export default {
  name: 'RevokeSCIMDialog',
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
        icon: 'mdi-minus-circle-outline',
        title: 'Revoke SCIM Setting?',
        subtitle: 'Instance will revoked permanently'
      },
      isActionButtonDisabled: false
    }
  },
  methods: {
    handleClose() {
      this.$emit('on-close')
    },
    handleRevoke() {
      this.isActionButtonDisabled = true
      revokeSCIMSetting(this.selectedRow.resourceId)
        .then((response) => {
          this.handleClose()
          this.$emit('on-success-revoke', response?.data?.data?.token)
        })
        .finally(() => (this.isActionButtonDisabled = false))
    }
  }
}
</script>
