<template>
  <app-dialog
    :status="status"
    icon="mdi-alert"
    title="Delete SMTP Setting?"
    :subtitle="getSubtitle"
    @changeStatus="handleCloseDialog"
  >
    <template v-slot:app-dialog-body>
      {{ getSubtitle }} will be deleted. All data will be lost.
    </template>
    <template v-slot:app-dialog-footer>
      <div class="d-flex download-buttons flex-row flex-wrap justify-end">
        <v-btn class="users__button" text color="#f56c6c" @click="handleCloseDialog">CANCEL</v-btn>
        <v-btn class="users__button" text color="#2196f3" @click="handleDelete">DELETE</v-btn>
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
export default {
  name: 'DeleteSmtpSettings',
  components: {
    AppDialog
  },
  props: {
    data: {},
    status: {
      type: Boolean
    }
  },
  computed: {
    getSubtitle() {
      const constructorName = this.data.constructor.name
      if (constructorName === 'Object') {
        return this.data.name
      } else if (constructorName === 'Array') {
        if (this.data.length === 1) {
          return this.data[0].name
        } else {
          return `${this.data.length} SMTP Settings`
        }
      }
      return this.data && this.data.name
    }
  },
  methods: {
    handleCloseDialog() {
      this.$emit('closeOverlay')
    },
    handleDelete() {
      const constructorName = this.data.constructor.name
      const action =
        constructorName === 'Object'
          ? 'handleDelete'
          : constructorName === 'Array'
          ? this.data.length === 1
            ? 'handleDelete'
            : 'handleMultipleDelete'
          : 'handleDelete'
      const data =
        constructorName === 'Object'
          ? this.data
          : constructorName === 'Array' && this.data.length === 1
          ? this.data[0]
          : this.data
      this.$emit(action, data)
      this.handleCloseDialog()
    }
  }
}
</script>
