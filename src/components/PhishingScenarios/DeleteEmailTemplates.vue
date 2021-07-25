<template>
  <app-dialog
    icon="mdi-delete"
    title="Delete Email Template?"
    subtitle="Email template will deleted permanently"
    title-id="text--email-template-delete-popup-title"
    subtitle-id="text--email-template-delete-popup-subtitle"
    :status="status"
    @changeStatus="closeModal"
  >
    <template v-slot:app-dialog-body>
      {{ selectedEmailTemplate && selectedEmailTemplate.name }} will be deleted.
    </template>
    <template v-slot:app-dialog-footer>
      <app-dialog-footer
        cancel-button-id="btn-cancel--email-template-popup"
        confirm-button-id="btn-delete--email-template-popup"
        type="delete"
        @handleClose="closeModal"
        @handleConfirm="handleDelete"
      />
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '../AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import { getEmailTemplatePreviewContent, deleteEmailTemplate } from '@/api/phishingsimulator'
export default {
  name: 'DeleteIntegration',
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
  methods: {
    closeModal() {
      this.$emit('handleCloseModal')
    },
    handleDelete() {
      deleteEmailTemplate(this.selectedEmailTemplate.resourceId)
        .then((response) => {
          this.$emit('handleSuccessDeleteAction')
        })
        .catch((error) => {})
      this.closeModal()
    }
  }
}
</script>

<style></style>
