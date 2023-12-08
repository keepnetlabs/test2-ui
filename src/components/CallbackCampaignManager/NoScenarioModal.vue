<template>
  <AppDialog
    icon="mdi-alert"
    title="You do not have any smishing scenarios"
    title-id="text--no-scenario-popup-title"
    :status="status"
    @changeStatus="closeModal"
  >
    <template #app-dialog-body>
      You need to have a scenario to start a smishing campaign.
    </template>
    <template #app-dialog-footer>
      <app-dialog-footer
        justify="space-between"
        cancel-button-id="btn-cancel--no-scenario-popup"
        confirm-button-id="btn-confirm--no-scenario-popup"
        actionButtonText="Create Scenario"
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
  name: 'NoScenarioModal',
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
