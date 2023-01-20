<template>
  <app-dialog
    type="delete"
    icon="mdi-delete"
    title="Delete Integration?"
    subtitle="The integration will deleted permanently"
    title-id="text--integration-delete-popup-title"
    subtitle-id="text--integration-delete-popup-subtitle"
    :status="status"
    @changeStatus="closeModal"
  >
    <template #app-dialog-body>
      {{ getIntegrationName }} will be deleted and removed from all integrations.
    </template>
    <template #app-dialog-footer>
      <app-dialog-footer
        cancel-button-id="btn-cancel--integrations-popup"
        confirm-button-id="btn-delete--integrations-popup"
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
      const action = this.getActionName()
      const data = this.getActionData()
      this.$emit(action, data)
      this.closeModal()
    },
    getActionName() {
      const constructorName = this.selectedIntegration.constructor.name
      if (constructorName === 'Object') return 'handleDelete'
      else if (constructorName === 'Array')
        return this.selectedIntegration.length === 1 ? 'handleDelete' : 'handleMultipleDelete'
      else return 'handleDelete'
    },
    getActionData() {
      const constructorName = this.selectedIntegration.constructor.name
      if (constructorName === 'Object') return this.selectedIntegration
      else if (constructorName === 'Array' && this.selectedIntegration.length === 1)
        return this.selectedIntegration[0]
      else return this.selectedIntegration
    }
  }
}
</script>
