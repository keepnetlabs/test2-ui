<template>
  <div class="users-dashboard-certificate-not-available-dialog">
    <AppDialog :status="status" :title="dialogTitle" @changeStatus="handleClose">
      <template #app-dialog-body>
        <div class="users-dashboard-certificate-not-available-dialog__body">
          <p class="users-dashboard-certificate-not-available-dialog__message">
            {{ labels.yourCertificatesWarningCanRetakeNoCertificate }}
          </p>
        </div>
      </template>
      <template #app-dialog-footer>
        <div style="display: flex; justify-content: flex-end; gap: 12px;">
          <VBtn
            id="btn--certificate-not-available-cancel"
            class="pa-0 k-dialog__button"
            text
            color="#F56C6C"
            @click="handleCancel"
          >
            {{ labels.cancel || 'Cancel' }}
          </VBtn>
          <VBtn
            id="btn--certificate-not-available-start-training"
            class="pa-0 k-dialog__button"
            text
            color="#2196f3"
            @click="handleStartTraining"
          >
            {{ labels.yourLearningStartTraining }}
          </VBtn>
        </div>
      </template>
    </AppDialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppDialog from '@/components/AppDialog'
import '@/assets/scss/pages/users-dashboard-certificate-not-available-dialog.scss'

export default {
  name: 'UsersDashboardCertificateNotAvailableDialog',
  components: {
    AppDialog
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    trainingUrl: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters({
      labels: 'usersDashboard/getLabels'
    }),
    dialogTitle() {
      return this.labels?.yourCertificatesNotAvailableTitle || 'Certificate Not Available'
    }
  },
  methods: {
    handleClose() {
      this.$emit('on-close')
    },
    handleCancel() {
      this.handleClose()
    },
    handleStartTraining() {
      if (this.trainingUrl) {
        window.open(this.trainingUrl, '_blank')
      }
      this.handleClose()
    }
  }
}
</script>
