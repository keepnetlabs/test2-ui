<template>
  <app-dialog
    icon="mdi-delete"
    title="Delete Scenario?"
    subtitle="Scenario will deleted permanently"
    title-id="text--scenario-delete-popup-title"
    subtitle-id="text--scenario-delete-popup-subtitle"
    :status="status"
    @changeStatus="closeModal"
  >
    <template v-slot:app-dialog-body>
      {{ selectedScenario && selectedScenario.name }} will be deleted.
    </template>
    <template v-slot:app-dialog-footer>
      <app-dialog-footer
        cancel-button-id="btn-cancel--scenario-popup"
        confirm-button-id="btn-delete--scenario-popup"
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
  methods: {
    closeModal() {
      this.$emit('handleCloseModal')
    },
    handleDelete() {
      deleteScenario(this.selectedScenario.resourceId)
        .then((response) => {
          this.$emit('handleSuccessDeleteAction')
        })
        .catch((error) => {})
      this.closeModal()
    }
  }
}
</script>

<style></style>
