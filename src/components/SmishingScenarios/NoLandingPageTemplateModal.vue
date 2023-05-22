<template>
  <AppDialog
    icon="mdi-alert"
    title="You do not have any landing page templates"
    title-id="text--no-landing-page-template-popup-title"
    :status="status"
    @changeStatus="closeModal"
  >
    <template #app-dialog-body>
      MFA, click-only and submit data scenarios require a landing page.
    </template>
    <template #app-dialog-footer>
      <app-dialog-footer
        justify="space-between"
        cancel-button-id="btn-cancel--no-landing-page-template-popup"
        confirm-button-id="btn-confirm--no-landing-page-template-popup"
        actionButtonText="Create Landing page template"
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
  name: 'NoLandingPageTemplateModal',
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
      this.$emit('handleCloseModal')
    },
    handleConfirm() {
      this.$emit('handleConfirm')
    }
  }
}
</script>
