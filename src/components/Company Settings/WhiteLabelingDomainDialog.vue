<template>
  <AppDialog
    id="white-labeling--domain-popup"
    icon="mdi-sync"
    title="Warning"
    title-id="text--whitelabeling-domain-popup-title"
    subtitle-id="text--whitelabeling-domain-popup-subtitle"
    :status="status"
    @changeStatus="handleCloseDialog"
  >
    <template v-slot:app-dialog-body>
      {{ errorMessage }}
    </template>
    <template v-slot:app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--white-labeling-domain-default-popup"
        confirm-button-id="btn-confirm--white-labeling-domain-default-popup"
        :confirm-button-disabled="isActionButtonDisabled"
        @handleClose="handleCloseDialog"
        @handleConfirm="handleConfirm"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
export default {
  name: 'WhiteLabelingDomainDialog',
  components: { AppDialogFooter, AppDialog },
  props: {
    status: {
      type: Boolean
    },
    isActionButtonDisabled: {
      type: Boolean
    },
    errorMessage: {
      type: String
    }
  },
  methods: {
    handleCloseDialog() {
      this.$emit('on-close')
    },
    handleConfirm() {
      this.$emit('on-confirm')
    }
  }
}
</script>
