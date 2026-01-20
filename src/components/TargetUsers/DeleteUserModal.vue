<template>
  <app-dialog
    :status="isShow"
    type="delete"
    icon="mdi-delete"
    title="Delete User?"
    subtitle="This action cannot be undone."
    title-id="text--target-users-people-delete-popup-title"
    subtitle-id="text--target-users-people-delete-popup-subtitle"
    @changeStatus="closeModal"
  >
    <template v-slot:app-dialog-body>
      <div>
        <p class="mb-4">
          {{ getTargetUserEmail }}
          will no longer receive any deliveries and will be removed from all groups.
        </p>
        <p class="mb-0">
          Historical data and reports related to this
          {{ isMultiple ? "users" : "user" }}
          will remain available on the platform.
        </p>
      </div>
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
    getTargetUserEmail() {
      return this.selectedRow ? `${this.selectedRow['email'] || ''}` : `${this.userCount} users`
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
