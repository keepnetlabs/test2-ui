<template>
  <AppDialog
    icon="mdi-link-off"
    title="Confirm Disable Microsoft Teams Integration"
    :status="status"
    type="delete"
    size="big"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <div class="text-primary-color">
        <div class="mb-4">
          Disabling will remove all accesses and stop Teams notifications. Are you sure?
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
