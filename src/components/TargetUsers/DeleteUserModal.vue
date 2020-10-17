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
      <div class="delete-user__footer">
        <v-btn @click="closeModal" color="#f56c6c" class="delete-user__footer-button" text
          >CANCEL</v-btn
        >
        <v-btn
          @click="handleDelete"
          color="#2196f3"
          class="delete-user__footer-button"
          style="padding: 0;"
          text
          >DELETE</v-btn
        >
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '../AppDialog'
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
