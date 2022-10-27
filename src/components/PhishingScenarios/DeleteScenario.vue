<template>
  <app-dialog
    type="delete"
    icon="mdi-delete"
    title="Delete Scenario?"
    subtitle="Scenario will deleted permanently"
    title-id="text--scenario-delete-popup-title"
    subtitle-id="text--scenario-delete-popup-subtitle"
    :status="status"
    @changeStatus="closeModal"
  >
    <template #app-dialog-body>
      {{ selectedScenario && selectedScenario.name }} will be deleted.
    </template>
    <template #app-dialog-footer>
      <app-dialog-footer
        cancel-button-id="btn-cancel--scenario-popup"
        confirm-button-id="btn-delete--scenario-popup"
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
import { deleteScenario } from '@/api/scenarios'
export default {
  name: 'DeleteScenario',
  components: {
    AppDialog,
    AppDialogFooter
  },
  props: {
    status: {
      type: Boolean
    },
    selectedScenario: {
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
      deleteScenario(this.selectedScenario.resourceId)
        .then(() => {
          this.$emit('handleSuccessDeleteAction', this.selectedScenario)
          this.closeModal()
        })
        .finally(() => {
          this.isActionButtonDisabled = false
        })
    }
  }
}
</script>
