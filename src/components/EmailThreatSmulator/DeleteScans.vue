<template>
  <app-dialog
    icon="mdi-delete"
    title="Delete Scans?"
    subtitle="Scans will deleted permanently"
    title-id="text--scenario-delete-popup-title"
    subtitle-id="text--scenario-delete-popup-subtitle"
    :status="status"
    @changeStatus="closeModal"
  >
    <template v-slot:app-dialog-body>
      {{ selectedScans && selectedScans.name }} will be deleted.
    </template>
    <template v-slot:app-dialog-footer>
      <app-dialog-footer
        cancel-button-id="btn-cancel--scans-popup"
        confirm-button-id="btn-delete--scans-popup"
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
  name: 'DeleteScans',
  components: {
    AppDialog,
    AppDialogFooter
  },
  props: {
    status: {
      type: Boolean
    },
    selectedScans: {
      type: Object
    }
  },
  methods: {
    closeModal() {
      this.$emit('handleCloseModal')
    },
    handleDelete() {
      deleteScenario(this.selectedScenario.resourceId).then(() => {
        this.$emit('handleSuccessDeleteAction')
      })
      this.closeModal()
    }
  }
}
</script>
