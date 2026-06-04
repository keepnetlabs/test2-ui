<template>
  <AppDialog
    id="dialog--campaign-manager-report-feedback-details"
    title-id="text--campaign-manager-report-feedback-details-title"
    subtitle-id="text--campaign-manager-report-feedback-details-subtitle"
    :status="status"
    :custom-size="'600'"
    class-name="campaign-manager-report-feedback-details-dialog-wrapper"
    icon="mdi-message-text"
    icon-class-name="campaign-manager-report-feedback-details-dialog__icon"
    title="Feedback Details"
    :subtitle="getSubtitle"
    @changeStatus="handleStatusChange"
  >
    <template #app-dialog-body>
      <div class="campaign-manager-report-feedback-details-dialog">
        <div class="campaign-manager-report-feedback-details-dialog__item">
          <span class="campaign-manager-report-feedback-details-dialog__label">
            Feedback Source:
          </span>
          <span>{{ getFeedbackSource }}</span>
        </div>
        <div class="campaign-manager-report-feedback-details-dialog__item">
          <span class="campaign-manager-report-feedback-details-dialog__label">
            Scenario Name:
          </span>
          <span>{{ getScenarioName }}</span>
        </div>
        <div class="campaign-manager-report-feedback-details-dialog__item">
          <div class="campaign-manager-report-feedback-details-dialog__label">
            User Feedback:
          </div>
          <div>{{ selectedRow.feedbackText || '-' }}</div>
        </div>
      </div>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooterWithClose
        id="btn-close--campaign-manager-report-feedback-details"
        @on-close="handleClose"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooterWithClose from '@/components/SmallComponents/AppDialogFooterWithClose.vue'

export default {
  name: 'CampaignManagerReportFeedbackDetailsDialog',
  components: {
    AppDialog,
    AppDialogFooterWithClose
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    selectedRow: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    getSubtitle() {
      return `${this.selectedRow.firstName || ''} ${this.selectedRow.lastName || ''}`.trim()
    },
    getFeedbackSource() {
      return (
        this.selectedRow.feedbackSource ||
        this.selectedRow.feedbackSourceName ||
        this.selectedRow.source ||
        this.selectedRow.sourceName ||
        'Just-in-Time Landing Page'
      )
    },
    getScenarioName() {
      return this.selectedRow.phishingScenarioName || this.selectedRow.scenarioName || '-'
    }
  },
  methods: {
    handleStatusChange(status) {
      if (!status) this.handleClose()
    },
    handleClose() {
      this.$emit('on-close')
    }
  }
}
</script>

<style lang="scss" scoped>
.campaign-manager-report-feedback-details-dialog {
  color: #555;
  font-size: 14px;

  &__item {
    margin-bottom: 12px;
  }

  &__label {
    color: #333;
    font-weight: 600;
    margin-right: 8px;
  }
}

::v-deep .campaign-manager-report-feedback-details-dialog-wrapper {
  .k-dialog__header {
    padding: 18px 24px !important;
  }

  .k-dialog__body {
    max-height: none !important;
    min-height: 0 !important;
    padding: 18px 24px 14px !important;
  }

  .k-dialog__footer {
    padding: 6px 24px 8px !important;
  }

  .v-cart-icon-wrapper {
    align-items: center;
    display: flex;
    justify-content: center;
  }

  .campaign-manager-report-feedback-details-dialog__icon {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
}
</style>
