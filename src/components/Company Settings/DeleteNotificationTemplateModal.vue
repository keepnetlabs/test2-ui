<template>
  <app-dialog
    :status="status"
    type="delete"
    id="notification-template-delete-popup"
    title-id="text--notification-template-delete-popup-title"
    subtitle-id="text--notification-template-delete-popup-subtitle"
    icon="mdi-alert"
    :title="getTitle"
    :subtitle="getSubtitle"
    @changeStatus="handleCloseDialog"
  >
    <template #app-dialog-body>{{ labels.DeleteNotificationTemplateBody }}</template>
    <template #app-dialog-footer>
      <app-dialog-footer
        type="delete"
        cancel-button-id="btn-cancel--notification-template-delete-popup"
        confirm-button-id="btn-delete--notification-template-delete-popup"
        @handleClose="handleCloseDialog"
        @handleConfirm="handleDelete"
      />
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import labels from '@/model/constants/labels'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
export default {
  name: 'DeleteNotificationTemplateModal',
  components: {
    AppDialogFooter,
    AppDialog
  },
  props: {
    selectedItem: {
      type: Object
    },
    status: {
      type: Boolean
    },
    isDeleteButtonDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return { labels }
  },
  computed: {
    getTitle() {
      return `Delete Notification Template`
    },
    getSubtitle() {
      return `${this.selectedItem.name}`
    }
  },
  methods: {
    handleDelete() {
      this.$emit('handleDelete', this.selectedItem.resourceId)
    },
    handleCloseDialog() {
      this.$emit('closeDialog')
    }
  }
}
</script>
