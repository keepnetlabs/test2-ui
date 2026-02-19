<template>
  <app-dialog
    type="delete"
    icon="mdi-delete"
    title="Delete Landing Page Template?"
    subtitle="Landing Page will deleted permanently"
    title-id="text--email-landing-page-delete-popup-title"
    subtitle-id="text--email-landing-page-delete-popup-subtitle"
    :status="status"
    @changeStatus="closeModal"
  >
    <template #app-dialog-body>
      {{ selectedEmailTemplate && selectedEmailTemplate.name }} will be deleted.
    </template>
    <template #app-dialog-footer>
      <app-dialog-footer
        cancel-button-id="btn-cancel--email-landing-page-popup"
        confirm-button-id="btn-delete--email-landing-page-popup"
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
import { deleteLandingPage } from '@/api/landingPage'
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
      deleteLandingPage(this.selectedEmailTemplate.resourceId)
        .then(() => {
          this.$emit('handleSuccessDeleteAction', this.selectedEmailTemplate)
          this.closeModal()
        })
        .catch(() => {})
        .finally(() => {
          this.isActionButtonDisabled = false
        })
    }
  }
}
</script>
