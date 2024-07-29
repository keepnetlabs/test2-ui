<template>
  <app-dialog
    type="delete"
    icon="mdi-delete"
    title="Delete Text Message Template?"
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
  </app-dialog>
</template>

<script>
import AppDialog from '../AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import SmishingService from '@/api/smishing'
export default {
  name: 'DeleteTemplateModal',
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
        return `${this.templateCount} smishing templates will be deleted.`
      }
      return `${this.selectedEmailTemplate && this.selectedEmailTemplate.name} will be deleted.`
    }
  },
  methods: {
    closeModal() {
      this.$emit('on-close')
    },
    handleDelete() {
      if (this.isMultiple) {
        this.isActionButtonDisabled = true
        SmishingService.bulkDeleteTextMessageTemplates(this.multipleDeletePayload)
          .then(() => {
            this.$emit('on-success-multiple')
          })
          .finally(() => {
            this.isActionButtonDisabled = false
          })
      } else {
        this.isActionButtonDisabled = true
        SmishingService.deleteTextMessageTemplate(this.selectedEmailTemplate.resourceId)
          .then(() => {
            this.$emit('on-success', this.selectedEmailTemplate)
          })
          .finally(() => {
            this.isActionButtonDisabled = false
          })
      }
    }
  }
}
</script>
