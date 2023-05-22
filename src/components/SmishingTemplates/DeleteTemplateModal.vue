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
      {{ selectedEmailTemplate && selectedEmailTemplate.name }} will be deleted.
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
import { deleteEmailTemplate } from '@/api/phishingsimulator'
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
    }
  },
  data() {
    return {
      isActionButtonDisabled: false
    }
  },
  methods: {
    closeModal() {
      this.$emit('handleCloseModal')
    },
    handleDelete() {
      this.isActionButtonDisabled = true
      deleteEmailTemplate(this.selectedEmailTemplate.resourceId)
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
</script>
