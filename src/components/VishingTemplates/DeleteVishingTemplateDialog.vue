<template>
  <AppDialog
    icon="mdi-delete"
    title="Delete Vishing Template?"
    subtitle="Vishing Template will be deleted permanently"
    title-id="text--vishing-template-delete-popup-title"
    subtitle-id="text--vishing-template-delete-popup-subtitle"
    type="delete"
    :status="status"
    @changeStatus="closeModal"
  >
    <template v-slot:app-dialog-body>
      {{ getBodyText }}
    </template>
    <template v-slot:app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--vishing-template-popup"
        confirm-button-id="btn-delete--vishing-template-popup"
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
import { deleteVishingTemplate, bulkDeleteVishingTemplates } from '@/api/vishing'
export default {
  name: 'DeleteVishingTemplateDialog',
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
        return `${this.templateCount} vishing templates will be deleted.`
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
        bulkDeleteVishingTemplates(this.multipleDeletePayload)
          .then(() => {
            this.$emit('on-success-multiple')
          })
          .finally(() => {
            this.isActionButtonDisabled = false
          })
      } else {
        this.isActionButtonDisabled = true
        deleteVishingTemplate(this.selectedTemplate.resourceId)
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
