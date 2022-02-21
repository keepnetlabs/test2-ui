<template>
  <app-dialog
    :status="isShow"
    icon="mdi-delete"
    title="Delete User?"
    subtitle="The user will deleted permanently"
    title-id="text--target-users-people-delete-popup-title"
    subtitle-id="text--target-users-people-delete-popup-subtitle"
    @changeStatus="closeModal"
  >
    <template v-slot:app-dialog-body>
      {{ getSystemUserName }} will be deleted and removed from all groups. User stats will remain in
      reports.
    </template>
    <template v-slot:app-dialog-footer>
      <app-dialog-footer
        :confirm-button-disabled="confirmButtonDisabled"
        cancel-button-id="btn-cancel--target-users-people-popup"
        confirm-button-id="btn-delete--target-users-people-popup"
        @handleClose="closeModal"
        @handleConfirm="handleDelete"
        type="delete"
      />
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '../AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
export default {
  props: {
    isShow: {
      type: Boolean
    },
    selectedRow: {},
    isMultiple: {
      type: Boolean
    },
    confirmButtonDisabled: {
      type: Boolean,
      default: false
    },
    userCount: {
      type: Number,
      default: 0
    }
  },
  components: {
    AppDialogFooter,
    AppDialog
  },
  computed: {
    getSystemUserName() {
      return this.selectedRow
        ? `${this.selectedRow['firstName'] || ''} ${this.selectedRow['lastName'] || ''}`
        : `${this.userCount} users`
    }
  },
  methods: {
    closeModal() {
      this.$emit('changeModalStatus', false)
    },
    handleDelete() {
      if (this.isMultiple) {
        this.$emit('deleteMultiple')
      } else {
        this.$emit('deleteAction', this.selectedRow)
      }
      this.$emit('changeModalStatus', false)
    }
  },
  name: 'DeleteUserModal'
}
</script>
