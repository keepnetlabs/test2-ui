<template>
  <app-dialog
    :status="status"
    icon="mdi-alert"
    title="Delete User"
    subtitle="Do you want to delete this rule?"
    @changeStatus="closeOverlay"
  >
    <template v-slot:app-dialog-body> This rule will be permanently deleted. </template>
    <template v-slot:app-dialog-footer>
      <div class="d-flex download-buttons flex-row flex-wrap justify-end">
        <v-btn class="users__button" text color="#f56c6c" @click="closeOverlay">CANCEL</v-btn>
        <v-btn class="users__button" text color="#2196f3" @click="handleDelete">DELETE</v-btn>
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
export default {
  name: 'DeleteSystemUserRoleModal',
  components: {
    AppDialog
  },
  props: {
    status: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeOverlay() {
      this.$emit('closeOverlay')
    },
    handleDelete() {
      this.$emit('handleDelete')
    }
  }
}
</script>

<style lang="scss"></style>
