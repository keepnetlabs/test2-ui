<template>
  <app-dialog
    :status="status"
    icon="mdi-alert"
    title="Delete Notification Template?"
    subtitle="Notification Template"
    @changeStatus="handleCloseDialog"
  >
    <template v-slot:app-dialog-body>
      This notification template will be deleted. All data will be lost.
    </template>
    <template v-slot:app-dialog-footer>
      <div class="d-flex download-buttons flex-row flex-wrap justify-end">
        <v-btn class="users__button" text color="#f56c6c" @click="handleCloseDialog">{{
          labels.Cancel
        }}</v-btn>
        <v-btn class="users__button" text color="#2196f3" @click="handleDelete">DELETE</v-btn>
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
    }
  },
  data() {
    return { labels }
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
