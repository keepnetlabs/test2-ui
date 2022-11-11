<template>
  <app-dialog
    v-if="status"
    :status="status"
    type="delete"
    icon="mdi-delete"
    title="Delete System User(s)?"
    :subtitle="getSubTitle"
    title-id="text--system-user-delete-popup-title"
    subtitle-id="text--system-user-delete-popup-subtitle"
    @changeStatus="closeModal"
  >
    <template #app-dialog-body>
      {{ getSystemUserEmail }} will be deleted and removed from system users.
    </template>
    <template #app-dialog-footer>
      <app-dialog-footer
        :confirm-button-disabled="confirmButtonDisabled"
        cancel-button-id="btn-cancel--system-users-people-popup"
        confirm-button-id="btn-delete--system-users-people-popup"
        type="delete"
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
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    userCount: {
      type: Number,
      default: 0
    }
  },
  computed: {
    getSystemUserEmail() {
      return this.selectedRow ? `${this.selectedRow['email'] || ''}` : `${this.userCount} users`
    },
    getSubTitle() {
      return `${
        this.isMultiple ? `${this.userCount} user(s)` : 'The system user'
      } will be deleted permanently`
    }
  },
  methods: {
    closeModal() {
      this.$emit('closeOverlay')
    },
    handleDelete() {
      if (this.isMultiple) {
        this.$emit('handleMultipleDelete')
      } else {
        this.$emit('handleDelete', this.selectedRow)
      }
    }
  }
}
</script>
