<template>
  <AppDialog
    type="delete"
    icon="mdi-delete"
    title="Delete Email Template?"
    subtitle="Email template will deleted permanently"
    title-id="text--email-template-delete-popup-title"
    subtitle-id="text--email-template-delete-popup-subtitle"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      {{ selectedEmailTemplate && selectedEmailTemplate.name }} will be deleted.
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--email-template-popup"
        confirm-button-id="btn-delete--email-template-popup"
        type="delete"
        :confirm-button-disabled="isActionButtonDisabled"
        @handleClose="handleClose"
        @handleConfirm="handleDelete"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import AppDialog from '@/components/AppDialog'

export default {
  name: 'CommonSimulatorEmailTemplateDeleteDialog',
  components: { AppDialog, AppDialogFooter },
  props: {
    status: {
      type: Boolean
    },
    selectedEmailTemplate: {
      type: Object
    },
    apiFunc: {
      type: Function
    }
  },
  data() {
    return {
      isActionButtonDisabled: false
    }
  },
  methods: {
    handleDelete() {
      this.isActionButtonDisabled = true
      this.apiFunc(this.selectedEmailTemplate.resourceId)
        .then(() => {
          this.$emit('on-success', this.selectedEmailTemplate)
        })
        .finally(() => {
          this.isActionButtonDisabled = false
        })
    },
    handleClose() {
      this.$emit('on-close')
    }
  }
}
</script>
