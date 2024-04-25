<template>
  <AppDialog
    type="delete"
    icon="mdi-delete"
    title="Delete Callback Template?"
    subtitle="Callback Template will deleted permanently"
    title-id="text--callback-template-delete-popup-title"
    subtitle-id="text--callback-template-delete-popup-subtitle"
    :status="status"
    @changeStatus="closeModal"
  >
    <template v-slot:app-dialog-body>
      {{ getBodyText }}
    </template>
    <template v-slot:app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--callback-template-popup"
        confirm-button-id="btn-delete--callback-template-popup"
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
  name: 'DeleteCallbackTemplateModal',
  components: {
    AppDialog,
    AppDialogFooter
  },
  emits: ['onCancel', 'onConfirm'],
  props: {
    status: {
      type: Boolean
    },
    selectedTemplate: {
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
      return `${this.selectedTemplate && this.selectedTemplate.name} will be deleted.`
    }
  },
  methods: {
    closeModal() {
      this.$emit('handleCloseModal')
    },
    handleDelete() {
      if (this.isMultiple) {
        this.isActionButtonDisabled = true
        CallbackService.bulkDeleteCallbackTemplates(this.multipleDeletePayload)
          .then(() => {
            this.$emit('on-success-multiple')
          })
          .finally(() => {
            this.isActionButtonDisabled = false
          })
      } else {
        this.isActionButtonDisabled = true
        CallbackService.deleteCallbackTemplate(this.selectedTemplate.resourceId)
          .then(() => {
            this.$emit('handleSuccessDeleteAction', this.selectedTemplate)
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
