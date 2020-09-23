<template>
  <app-dialog
    :status="status"
    icon="mdi-delete"
    title="Delete Integration?"
    subtitle="The integration will  deleted permanently"
  >
    <template v-slot:app-dialog-body>
      {{ getIntegrationName }} will be deleted and removed from all integrations.
    </template>
    <template v-slot:app-dialog-footer>
      <div class="delete-user__footer">
        <v-btn @click="closeModal" color="#f56c6c" class="delete-user__footer-button" text
          >CANCEL</v-btn
        >
        <v-btn
          @click="handleDelete"
          color="#2196f3"
          class="delete-user__footer-button"
          style="padding: 0;"
          text
          >DELETE</v-btn
        >
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '../AppDialog'
export default {
  name: 'DeleteIntegration',
  components: {
    AppDialog
  },
  props: {
    status: {
      type: Boolean
    },
    selectedIntegration: {
      type: Object,
      default() {
        return {
          name: ''
        }
      }
    }
  },
  computed: {
    getIntegrationName() {
      return this.selectedIntegration.name || ''
    }
  },
  methods: {
    closeModal() {
      this.$emit('handleCloseModal')
    },
    handleDelete() {
      this.$emit('handleDelete', this.selectedIntegration)
    }
  }
}
</script>

<style></style>
