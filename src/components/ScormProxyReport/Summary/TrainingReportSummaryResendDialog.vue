<template>
  <AppDialog
    title-id="text--training-report-resend-popup-title"
    subtitle-id="text--training-report-resend-popup-subtitle"
    :icon="CONSTANTS.icon"
    :title="CONSTANTS.title"
    :subtitle="trainingName"
    :status="status"
    @changeStatus="closeModal"
  >
    <template #app-dialog-body>
      <div>
        <div class="mb-3">Resend this training to:</div>
        <div>
          <v-checkbox
            v-model="types"
            id="input--training-report-email-failed-to-send"
            color="#2196f3"
            :disabled="!items.emailErrorUserCount"
            :value="1"
          >
            <template #label>
              Email failed to send {{ `(${items.emailErrorUserCount || 0})` }}</template
            >
          </v-checkbox>
          <v-checkbox
            v-model="types"
            id="input--training-report-email-failed-to-send"
            color="#2196f3"
            :disabled="!items.totalUserOpenedCount"
            :value="2"
          >
            <template #label
              >Only opened email {{ `(${items.totalUserOpenedCount || 0})` }}</template
            >
          </v-checkbox>
          <v-checkbox
            v-model="types"
            id="input--training-report-email-failed-to-send"
            color="#2196f3"
            :disabled="!items.totalUserClickedCount"
            :value="3"
          >
            <template #label
              >Clicked training link {{ `(${items.totalUserClickedCount || 0})` }}</template
            >
          </v-checkbox>
          <v-checkbox
            v-model="types"
            id="input--training-report-email-failed-to-send"
            color="#2196f3"
            :disabled="!items.didNotCompleteTrainingCount"
            :value="4"
          >
            <template #label
              >Didn't complete training
              {{ `(${items.didNotCompleteTrainingCount || 0})` }}</template
            > </v-checkbox
          ><v-checkbox
            v-model="types"
            id="input--training-report-email-failed-to-send"
            color="#2196f3"
            :disabled="!items.failedExamCount"
            :value="6"
          >
            <template #label>Failed exam {{ `(${items.failedExamCount || 0})` }}</template>
          </v-checkbox>
          <v-checkbox
            v-model="types"
            id="input--training-report-email-failed-to-send"
            color="#2196f3"
            :disabled="!items.noResponseCount"
            :value="7"
          >
            <template #label>No response {{ `(${items.noResponseCount || 0})` }}</template>
          </v-checkbox>
        </div>
      </div>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--training-report-resend-popup"
        confirm-button-id="btn-delete--training-report-resend-popup"
        :action-button-text="labels.Resend"
        :confirm-button-disabled="getActionButtonDisabled"
        @handleClose="closeModal"
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
  name: 'TrainingReportSummaryResendDialog',
  components: { AppDialogFooter, AppDialog },
  props: {
    status: {
      type: Boolean
    },
    isActionButtonDisabled: {
      type: Boolean
    },
    items: {
      type: Object
    },
    trainingName: {
      type: String
    }
  },
  data() {
    return {
      CONSTANTS: {
        icon: 'mdi-refresh',
        title: labels.ResendTraining
      },
      labels,
      types: []
    }
  },
  computed: {
    getActionButtonDisabled() {
      return this.isActionButtonDisabled || !this.types.length
    }
  },
  methods: {
    closeModal() {
      this.$emit('on-close')
    },
    handleConfirm() {
      this.$emit('on-confirm', this.types)
    }
  }
}
</script>
