<template>
  <AppDialog
    title-id="text--training-report-resend-popup-title"
    subtitle-id="text--training-report-resend-popup-subtitle"
    :icon="CONSTANTS.icon"
    :title="title"
    :subtitle="trainingName"
    :status="status"
    @changeStatus="closeModal"
  >
    <template #app-dialog-body>
      <div>
        <div class="mb-3">Resend this {{ getTypeText }} to:</div>
        <div>
          <v-checkbox
            v-model="types"
            id="input--training-report-email-failed-to-send"
            color="#2196f3"
            :disabled="!items.emailErrorUserCount"
            :value="1"
          >
            <template #label>
              Email failed to send
              {{ `(${items.emailErrorUserCount || 0})` }}</template
            >
          </v-checkbox>
          <v-checkbox
            v-model="types"
            id="input--training-report-email-failed-to-send"
            color="#2196f3"
            :disabled="!items.onlyOpenedCount"
            :value="2"
          >
            <template #label
              >Only opened {{ getOnlyOpenedLabel }}
              {{ `(${items.onlyOpenedCount || 0})` }}</template
            >
          </v-checkbox>
          <v-checkbox
            v-if="isTrainingTypeTraining"
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
            v-if="isTrainingTypeTraining"
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
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '../../../TrainingLibrary/TrainingLibraryFirstCard/utils'
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
    },
    title: {
      type: String,
      default: labels.ResendTraining
    },
    trainingType: {
      type: String
    }
  },
  data() {
    return {
      CONSTANTS: {
        icon: 'mdi-refresh'
      },
      labels,
      types: []
    }
  },
  computed: {
    getTypeText() {
      if (this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER) return 'poster'
      else if (this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC)
        return 'infographic'
      else if (this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH)
        return 'learning path'
      return 'training'
    },
    getActionButtonDisabled() {
      return this.isActionButtonDisabled || !this.types.length
    },
    getOnlyOpenedLabel() {
      if (this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER) return 'poster'
      else if (this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC)
        return 'infographic'
      return 'email'
    },
    isTrainingTypeTraining() {
      return this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING
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
