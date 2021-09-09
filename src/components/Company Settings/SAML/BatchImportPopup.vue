<template>
  <app-dialog
    id="saml-settings-batch-import-popup"
    title-id="text--saml-settings-batch-import-popup-title"
    subtitle-id="text--saml-settings-batch-import-popup-subtitle"
    icon="mdi-alert"
    class-name="batch-import-popup"
    size="big"
    :status="status"
    :title="labels.BatchImport"
    :subtitle="subtitle"
    @changeStatus="handleCloseDialog"
  >
    <template v-slot:app-dialog-body>
      <v-textarea
        v-model.trim="text"
        outlined
        dense
        rows="2"
        no-resize
        placeholder="Enter Custom Header"
        height="150"
      ></v-textarea>
    </template>
    <template v-slot:app-dialog-footer>
      <app-dialog-footer
        cancel-button-id="btn-cancel--saml-settings-batch-import-popup"
        confirm-button-id="btn-delete--saml-settings-batch-import-popup"
        @handleClose="handleCloseDialog"
        @handleConfirm="handleConfirm"
      />
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import labels from '@/model/constants/labels'
export default {
  name: 'BatchImportPopup',
  components: { AppDialogFooter, AppDialog },
  props: {
    status: {
      type: Boolean
    },
    subtitle: {
      type: String,
      default: labels.BatchImportPopupSubtitle
    }
  },
  emits: ['on-confirm', 'on-close'],
  data() {
    return {
      labels,
      text: ''
    }
  },
  methods: {
    handleCloseDialog() {
      this.$emit('on-close')
    },
    handleConfirm() {
      const { text } = this
      this.$emit(
        'on-confirm',
        text
          .replaceAll('\n', ',')
          .split(',')
          .filter((item) => item)
      )
      this.handleCloseDialog()
    }
  }
}
</script>
<style lang="scss">
.batch-import-popup {
  .k-dialog__body {
    padding-bottom: 0;
  }
}
</style>
