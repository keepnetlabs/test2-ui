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
      {{ selectedTemplate && selectedTemplate.name }} will be deleted.
    </template>
    <template v-slot:app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--callback-template-popup"
        confirm-button-id="btn-delete--callback-template-popup"
        type="delete"
        @handleClose="closeModal"
        @handleConfirm="handleDelete"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
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
    }
  },
  methods: {
    closeModal() {
      this.$emit('onCancel')
    },
    handleDelete() {
      this.$emit('onConfirm')
    }
  }
}
</script>
