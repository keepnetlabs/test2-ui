<template>
  <app-dialog
    :status="status"
    icon="mdi-delete"
    title="Delete System User?"
    subtitle="The system user will  deleted permanently"
  >
    <template v-slot:app-dialog-body>
      {{ getSystemUserName }} will be deleted and removed from system users.
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
import AppDialog from '@/components/AppDialog'
export default {
  name: 'DeleteSystemUserModal',
  components: {
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
