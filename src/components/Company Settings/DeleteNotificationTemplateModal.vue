<template>
  <app-dialog
    :status="status"
    icon="mdi-alert"
    :title="getTitle"
    :subtitle="labels.NotificationTemplate"
    id="notification-template-delete-popup"
    @changeStatus="handleCloseDialog"
  >
    <template v-slot:app-dialog-body>{{ labels.DeleteNotificationTemplateBody }}</template>
    <template v-slot:app-dialog-footer>
      <div class="d-flex download-buttons flex-row flex-wrap justify-end">
        <v-btn
          class="users__button"
          id="btn-cancel--notification-template-delete-popup"
          text
          color="#f56c6c"
          @click="handleCloseDialog"
          >{{ labels.Cancel }}</v-btn
        >
        <v-btn
          :disabled="isDeleteButtonDisabled"
          id="btn-delete--notification-template-delete-popup"
          class="users__button"
          text
          color="#2196f3"
          @click="handleDelete"
          >{{ labels.Delete }}</v-btn
        >
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import labels from '@/model/constants/labels'

export default {
  name: 'DeleteNotificationTemplateModal',
  components: {
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
      return `${labels.Delete} ${this.selectedItem.name}`
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

<style></style>
