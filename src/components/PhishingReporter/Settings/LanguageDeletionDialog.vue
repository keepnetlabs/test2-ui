<template>
  <AppDialog
    v-if="status"
    :status="status"
    icon="mdi-delete"
    title="Confirm Language Deletion"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body
      >Are you sure you want to delete this language? This action cannot be undone, and all
      associated settings will be permanently removed.</template
    >
    <template #app-dialog-footer>
      <AppDialogFooter
        action-button-text="CONFIRM"
        action-button-color="#2196F3"
        cancel-button-text="CANCEL"
        cancel-button-color="#F56C6C"
        @handleClose="handleClose"
        @handleConfirm="handleConfirm"
      />
    </template>
  </AppDialog>
</template>

<script>
import labels from '@/model/constants/labels'
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
export default {
  name: 'LanguageDeletionDialog',
  components: { AppDialogFooter, AppDialog },
  props: {
    status: {
      type: Boolean
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    handleConfirm() {
      this.$emit('confirm')
    }
  }
}
</script>
