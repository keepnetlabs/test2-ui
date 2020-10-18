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
    selectedIntegration: {}
  },
  computed: {
    getIntegrationName() {
      const constructorName = this.selectedIntegration.constructor.name
      if (constructorName === 'Object') {
        return this.selectedIntegration.name
      } else if (constructorName === 'Array') {
        if (this.selectedIntegration.length === 1) {
          return this.selectedIntegration[0].name
        } else {
          return `${this.selectedIntegration.length} integrations`
        }
      }
      return this.selectedIntegration.name || ''
    }
  },
  methods: {
    closeModal() {
      this.$emit('handleCloseModal')
    },
    handleDelete() {
      const constructorName = this.selectedIntegration.constructor.name
      const action =
        constructorName === 'Object'
          ? 'handleDelete'
          : constructorName === 'Array'
          ? this.selectedIntegration.length === 1
            ? 'handleDelete'
            : 'handleMultipleDelete'
          : 'handleDelete'
      const data =
        constructorName === 'Object'
          ? this.selectedIntegration
          : constructorName === 'Array' && this.selectedIntegration.length === 1
          ? this.selectedIntegration[0]
          : this.selectedIntegration
      this.$emit(action, data)
      this.closeModal()
    }
  }
}
</script>

<style></style>
