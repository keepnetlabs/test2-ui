<template>
  <AppDialog
    icon="mdi-briefcase"
    title-id="text--company-configure-new-company-title"
    subtitle-id="text-company-configure-new-company-subtitle"
    :title="labels.ConfigureNewCompanyTitle"
    :status="status"
    :subtitle="companyName"
    @changeStatus="handleClose"
  >
    <template v-slot:app-dialog-body>
      Would you like to configure settings for the company you just created?
    </template>
    <template v-slot:app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--company-configure-new-company-popup"
        confirm-button-id="btn-confirm--company-configure-new-company-popup"
        :cancel-button-text="labels.Skip"
        cancel-button-color="#F56C6C"
        :action-button-text="labels.YesConfigure"
        @handleClose="handleClose"
        @handleConfirm="handleConfirm"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import labels from '@/model/constants/labels'
export default {
  name: 'ConfigureNewCompanyDialog',
  components: { AppDialogFooter, AppDialog },
  props: {
    companyName: {
      type: String
    },
    status: {
      type: Boolean
    }
  },
  data() {
    return {
      labels
    }
  },
  methods: {
    handleClose() {
      this.$emit('on-close')
    },
    handleConfirm() {
      this.$emit('on-confirm')
    }
  }
}
</script>
