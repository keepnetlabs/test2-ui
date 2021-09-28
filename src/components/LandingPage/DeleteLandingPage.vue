<template>
  <app-dialog
    icon="mdi-delete"
    title="Delete Landing Page Template?"
    subtitle="Landing Page will deleted permanently"
    title-id="text--email-landing-page-delete-popup-title"
    subtitle-id="text--email-landing-page-delete-popup-subtitle"
    :status="status"
    @changeStatus="closeModal"
  >
    <template v-slot:app-dialog-body>
      {{ selectedEmailTemplate && selectedEmailTemplate.name }} will be deleted.
    </template>
    <template v-slot:app-dialog-footer>
      <app-dialog-footer
        cancel-button-id="btn-cancel--email-landing-page-popup"
        confirm-button-id="btn-delete--email-landing-page-popup"
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
