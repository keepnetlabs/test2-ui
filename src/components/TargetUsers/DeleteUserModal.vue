<template>
  <app-dialog
    :status="isShow"
    icon="mdi-delete"
    title="Delete User?"
    subtitle="The user will deleted permanently"
  >
    <template v-slot:app-dialog-body>
      {{ getFirstAndLastName }} will be deleted and removed from all groups. User stats will remain
      in reports.
    </template>
    <template v-slot:app-dialog-footer>
      <app-dialog-footer @handleClose="closeModal" @handleConfirm="handleDelete" />
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
    }
  },
  components: {
    AppDialogFooter,
    AppDialog
  },
  computed: {
    getFirstAndLastName() {
      if (!this.isMultiple && this.selectedRow.constructor.name === 'Object') {
        const { firstName = '', lastName = '' } = this.selectedRow
        return `${firstName} ${lastName}`
      } else if (this.selectedRow.constructor.name === 'Array' && this.selectedRow.length === 1) {
        const { firstName = '', lastName = '' } = this.selectedRow[0]
        return `${firstName} ${lastName}`
      }
      return `${this.selectedRow.length} users`
    }
  },
  methods: {
    closeModal() {
      this.$emit('changeModalStatus', false)
    },
    handleDelete() {
      const action = this.isMultiple ? 'deleteMultiple' : 'deleteAction'
      const data = this.isMultiple
        ? this.selectedRow
        : this.selectedRow.constructor.name === 'Object'
        ? this.selectedRow
        : this.selectedRow[0]
      this.$emit(action, data)
      this.$emit('changeModalStatus', false)
    }
  },
  name: 'DeleteUserModal'
}
</script>

<style lang="scss">
.delete-user {
  &__footer {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    &-button {
      font-size: 14px;
      font-weight: 600;
      line-height: 1.71;
      letter-spacing: normal;
    }
  }
}
</style>
