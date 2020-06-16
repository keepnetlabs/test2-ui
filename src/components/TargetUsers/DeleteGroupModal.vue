<template>
  <app-dialog
    :status="status"
    icon="mdi-alert"
    title="Delete Group"
    subtitle="Do you want to delete this group?"
    @changeStatus="changeDeleteGroupStatus"
  >
    <template v-slot:app-dialog-body> {{ getGroupName }} will be deleted ! </template>
    <template v-slot:app-dialog-footer>
      <div class="d-flex download-buttons flex-row flex-wrap justify-end">
        <v-btn class="users__button" text color="#f56c6c" @click="changeDeleteGroupStatus(true)"
          >CANCEL</v-btn
        >
        <v-btn class="users__button" text color="#2196f3" @click="handleDeleteUser">DELETE</v-btn>
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '../AppDialog'
export default {
  name: 'DeleteGroupModal',
  components: {
    AppDialog
  },
  props: {
    selectedRow: {
      type: Object
    },
    status: {
      type: Boolean
    }
  },
  computed: {
    getGroupName() {
      return this.selectedRow.name
    }
  },
  methods: {
    changeDeleteGroupStatus(status) {
      this.$emit('changeDeleteGroupModalStatus', status)
    },
    handleDeleteUser() {
      this.$emit('handleDelete')
    }
  }
}
</script>

<style lang="scss"></style>
