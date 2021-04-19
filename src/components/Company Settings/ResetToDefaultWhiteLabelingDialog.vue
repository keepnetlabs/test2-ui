<template>
  <app-dialog
    id="white-labeling--reset-to-default-popup"
    icon="mdi-sync"
    custom-size="505"
    title="Reset whitelabeling settings to default?"
    title-id="text--whitelabeling-reset-popup-title"
    subtitle-id="text--whitelabeling-reset-popup-subtitle"
    :status="status"
    @changeStatus="handleCloseDialog"
  >
    <template v-slot:app-dialog-body>You will lose all changes</template>
    <template v-slot:app-dialog-footer>
      <app-dialog-footer
        cancel-button-id="btn-cancel--white-labeling-reset-to-default-popup"
        confirm-button-id="btn-confirm--white-labeling-reset-to-default-popup"
        :confirm-button-disabled="isResetToDefaultActionButtonDisabled"
        @handleClose="handleCloseDialog"
        @handleConfirm="handleConfirm"
      />
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
export default {
  name: 'ResetToDefaultWhiteLabelingDialog',
  components: {
    AppDialogFooter,
    AppDialog
  },
  props: {
    status: {
      type: Boolean
    },
    isResetToDefaultActionButtonDisabled: {
      type: Boolean
    }
  },
  methods: {
    handleCloseDialog() {
      this.$emit('handleCloseDialog')
    },
    handleConfirm() {
      this.$emit('handleConfirm')
    }
  }
}
</script>
