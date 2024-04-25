<template>
  <AppDialog
    type="delete"
    icon="mdi-delete"
    title="Delete Email Template?"
    subtitle="Email template will deleted permanently"
    title-id="text--email-template-delete-popup-title"
    subtitle-id="text--email-template-delete-popup-subtitle"
    :status="status"
    @changeStatus="closeModal"
  >
    <template #app-dialog-body>
      {{ getBodyText }}
    </template>
    <template #app-dialog-footer>
      <app-dialog-footer
        cancel-button-id="btn-cancel--email-template-popup"
        confirm-button-id="btn-delete--email-template-popup"
        type="delete"
        :confirm-button-disabled="isActionButtonDisabled"
        @handleClose="closeModal"
        @handleConfirm="handleDelete"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import CallbackService from '@/api/callback'
export default {
  name: 'CallbackDeleteEmailTemplate',
  components: {
    AppDialog,
    AppDialogFooter
  },
  props: {
    status: {
      type: Boolean
    },
    selectedEmailTemplate: {
      type: Object
    },
    templateCount: {
      type: Number,
      default: 0
    },
    isMultiple: {
      type: Boolean
    },
    multipleDeletePayload: {
      type: Object
    }
  },
  data() {
    return {
      isActionButtonDisabled: false
    }
  },
  computed: {
    getBodyText() {
      if (this.isMultiple) {
        return `${this.templateCount} email templates will be deleted.`
      }
      return `${this.selectedEmailTemplate && this.selectedEmailTemplate.name} will be deleted.`
    }
  },
  methods: {
    closeModal() {
      this.$emit('handleCloseModal')
    },
    handleDelete() {
      if (this.isMultiple) {
        this.isActionButtonDisabled = true
        CallbackService.bulkDeleteEmailTemplates(this.multipleDeletePayload)
          .then(() => {
            this.$emit('on-success-multiple')
          })
          .finally(() => {
            this.isActionButtonDisabled = false
          })
      } else {
        this.isActionButtonDisabled = true
        CallbackService.deleteEmailTemplate(this.selectedEmailTemplate.resourceId)
          .then(() => {
            this.$emit('handleSuccessDeleteAction', this.selectedEmailTemplate)
            this.closeModal()
          })
          .finally(() => {
            this.isActionButtonDisabled = false
          })
      }
    }
  }
}
</script>
