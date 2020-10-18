<template>
  <app-dialog
    :status="status"
    icon="mdi-alert"
    title="Delete Group"
    subtitle="Do you want to delete this group?"
    @changeStatus="changeDeleteGroupStatus"
  >
    <template v-slot:app-dialog-body> {{ getGroupName }} will be permanently deleted. </template>
    <template v-slot:app-dialog-footer>
      <div class="d-flex download-buttons flex-row flex-wrap justify-end">
        <v-btn class="users__button" text color="#f56c6c" @click="changeDeleteGroupStatus(false)"
          >CANCEL</v-btn
        >
        <v-btn class="users__button" text color="#2196f3" @click="handleDelete">DELETE</v-btn>
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
    selectedRow: {},
    status: {
      type: Boolean
    }
  },
  computed: {
    getGroupName() {
      const constructorName = this.selectedRow.constructor.name
      if (constructorName === 'Object') {
        return this.selectedRow.name
      } else if (constructorName === 'Array') {
        if (this.selectedRow.length === 1) {
          return this.selectedRow[0].name
        } else {
          return `${this.selectedRow.length} groups`
        }
      }
      return ''
    }
  },
  methods: {
    changeDeleteGroupStatus(status) {
      this.$emit('changeDeleteGroupModalStatus', status)
    },
    handleDelete() {
      const constructorName = this.selectedRow.constructor.name
      const action =
        constructorName === 'Object'
          ? 'handleDelete'
          : constructorName === 'Array'
          ? this.selectedRow.length === 1
            ? 'handleDelete'
            : 'handleMultipleDelete'
          : 'handleDelete'
      const data =
        constructorName === 'Object'
          ? this.selectedRow
          : constructorName === 'Array' && this.selectedRow.length === 1
          ? this.selectedRow[0]
          : this.selectedRow
      this.$emit(action, data)
      this.$emit('changeDeleteGroupModalStatus', false)
    }
  }
}
</script>

<style lang="scss"></style>
