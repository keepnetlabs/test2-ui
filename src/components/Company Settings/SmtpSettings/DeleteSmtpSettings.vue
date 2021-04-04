<template>
  <app-dialog
    :status="status"
    icon="mdi-alert"
    title="Delete SMTP Setting"
    :subtitle="getSubtitle"
    id="smtp-settings-delete-popup"
    @changeStatus="handleCloseDialog"
  >
    <template v-slot:app-dialog-body>
      This smtp setting will be deleted. All data will be lost.
    </template>
    <template v-slot:app-dialog-footer>
      <app-dialog-footer
        cancel-button-id="btn-cancel--smtp-settings-popup"
        confirm-button-id="btn-delete--smtp-settings-popup"
        type="delete"
        @handleClose="handleCloseDialog"
        @handleConfirm="handleDelete"
      />
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
export default {
  name: 'DeleteSmtpSettings',
  components: {
    AppDialogFooter,
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
