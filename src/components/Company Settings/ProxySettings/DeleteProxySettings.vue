<template>
  <app-dialog
    :status="status"
    type="delete"
    id="proxy-settings-delete-popup"
    title-id="text--proxy-settings-delete-popup-title"
    subtitle-id="text--proxy-settings-delete-popup-subtitle"
    icon="mdi-alert"
    title="Delete Proxy Setting"
    :subtitle="getSubtitle"
    @changeStatus="handleCloseDialog"
  >
    <template #app-dialog-body>
      This proxy setting will be deleted. All data will be lost.
    </template>
    <template #app-dialog-footer>
      <app-dialog-footer
        cancel-button-id="btn-cancel--proxy-settings-popup"
        confirm-button-id="btn-delete--proxy-settings-popup"
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
  name: 'DeleteProxySettings',
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
      return this?.data?.name || ''
    }
  },
  methods: {
    handleCloseDialog() {
      this.$emit('closeOverlay')
    },
    handleDelete() {
      this.$emit('handleDelete', this.data)
      this.handleCloseDialog()
    }
  }
}
</script>
