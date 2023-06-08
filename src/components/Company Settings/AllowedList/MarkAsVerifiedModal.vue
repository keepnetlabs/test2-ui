<template>
  <div v-if="status">
    <app-dialog
      icon="mdi-check"
      title="Mark as Verified"
      :subtitle="selectedDomain.domain"
      title-id="text--domain-mark-as-verified-popup-title"
      subtitle-id="text--domain-mark-as-verified-popup-subtitle"
      :status="status"
      @changeStatus="closeModal"
    >
      <template v-slot:app-dialog-body>
        <div class="domain-mark-as-verified-text-container">
          <div class="delete-title">
            Do you want to mark the selected domain as verified?
          </div>
        </div>
      </template>
      <template v-slot:app-dialog-footer>
        <app-dialog-footer
          cancel-button-id="btn-cancel--mark-as-verified-domain-popup"
          confirm-button-id="btn-confirm--mark-as-verified-domain-popup"
          actionButtonText="Mark As Verified"
          @handleClose="closeModal"
          @handleConfirm="handleConfirm"
          :confirmButtonDisabled="buttonDisableStatus"
        />
      </template>
    </app-dialog>
  </div>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import { markAsVerified } from '@/api/allowList'
export default {
  name: 'MarkAsVerifiedSuccessModal',
  components: {
    AppDialog,
    AppDialogFooter
  },
  props: {
    status: {
      type: Boolean
    },
    selectedDomain: {
      type: Object
    }
  },
  data() {
    return {
      buttonDisableStatus: false
    }
  },
  methods: {
    closeModal() {
      this.$emit('handleCloseModal')
    },
    handleConfirm() {
      this.buttonDisableStatus = true
      markAsVerified(this.selectedDomain.allowListResourceId)
        .then((res) => {
          if (res?.data?.status === 'SUCCESS') {
            this.$emit('handleMarkAsVerifiedSuccess')
          }
        })
        .finally(() => {
          this.buttonDisableStatus = false
        })
    }
  }
}
</script>
