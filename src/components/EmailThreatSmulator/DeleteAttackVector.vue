<template>
  <app-dialog
    type="delete"
    icon="mdi-delete"
    title="Delete Attack Vector?"
    subtitle="Scans will deleted permanently"
    title-id="text--scenario-delete-popup-title"
    subtitle-id="text--scenario-delete-popup-subtitle"
    :status="status"
    @changeStatus="closeModal"
  >
    <template v-slot:app-dialog-body>
      {{ selectedItem && selectedItem.pluginName }} will be deleted.
    </template>
    <template v-slot:app-dialog-footer>
      <app-dialog-footer
        cancel-button-id="btn-cancel--scans-popup"
        confirm-button-id="btn-delete--scans-popup"
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
import { deleteAttackVectorItem } from '@/api/emailThreatSimlator'
export default {
  name: 'DeleteAttackVector',
  components: {
    AppDialog,
    AppDialogFooter
  },
  props: {
    status: {
      type: Boolean
    },
    selectedItem: {
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
      deleteAttackVectorItem(this.selectedItem.pluginResourceId)
        .then(() => {
          this.$emit('handleSuccessDeleteAction')
          this.closeModal()
        })
        .finally(() => {
          this.isActionButtonDisabled = false
        })
    }
  }
}
</script>
