<template>
  <app-dialog
    :status="status"
    icon="mdi-delete"
    title="Delete System User?"
    subtitle="The system user will deleted permanently"
  >
    <template v-slot:app-dialog-body>
      {{ getSystemUserName }} will be deleted and removed from system users.
    </template>
    <template v-slot:app-dialog-footer>
      <app-dialog-footer
        :confirm-button-disabled="confirmButtonDisabled"
        cancel-button-id="btn-cancel--system-users-people-popup"
        confirm-button-id="btn-delete--system-users-people-popup"
        @handleClose="closeModal"
        @handleConfirm="handleDelete"
      />
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
export default {
  name: 'DeleteSystemUserModal',
  components: {
    AppDialogFooter,
    AppDialog
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    selectedRow: {
      type: Object,
      default: null
    },
    confirmButtonDisabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    getSystemUserName() {
      return this.selectedRow && `${this.selectedRow['firstName']} ${this.selectedRow['lastName']}`
    }
  },
  methods: {
    closeModal() {
      this.$emit('closeOverlay')
    },
    handleDelete() {
      this.$emit('handleDelete', this.selectedRow)
    }
  }
}
</script>

<style></style>
