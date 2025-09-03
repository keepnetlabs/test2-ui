<template>
  <AppDialog
    icon="mdi-link-off"
    title="Disable Microsoft Teams Integration"
    :status="status"
    type="delete"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <div class="text-primary-color">
        <div class="mb-4">
          Disabling will revoke all access and stop Teams notifications from being sent.
        </div>
        <div>
          Are you sure you want to proceed?
        </div>
      </div>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        type="delete"
        isForceActionButtonText
        :confirm-button-disabled="isActionButtonDisabled"
        actionButtonText="DISABLE INTEGRATION"
        @handleClose="handleClose"
        @handleConfirm="handleConfirm"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'

export default {
  name: 'DisableMicrosoftTeamsModal',
  components: {
    AppDialog,
    AppDialogFooter
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    isActionButtonDisabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClose() {
      this.$emit('on-close')
    },
    handleConfirm() {
      this.$emit('on-confirm')
    }
  }
}
</script>