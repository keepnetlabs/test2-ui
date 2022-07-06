<template>
  <AppModal
    :status="status"
    icon-name="mdi-send"
    :title="getTitle"
    title-id="text--add-or-edit-training-modal-title"
    @closeOverlay="handleClose"
  >
    <template #overlay-body>
      <v-stepper v-model="step" class="k-stepper">
        <v-stepper-header class="k-stepper__header">
          <v-stepper-step
            id="step--training-select-users"
            class="k-stepper__step"
            :complete="step > 1"
            :step="1"
            >{{ labels.SelectUsers }}
          </v-stepper-step>
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            id="step--training-settings"
            class="k-stepper__step"
            :complete="step > 2"
            :step="2"
            >{{ labels.Settings }}
          </v-stepper-step>
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            id="step--training-send-preview"
            class="k-stepper__step"
            :complete="step > 3"
            :step="3"
            >{{ labels.Preview }}
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items class="k-stepper__items">
          <v-stepper-content class="k-stepper__content" :step="1">
            <ConfigureCompanyStepHeader
              class="mb-8"
              :title="labels.SelectRecipients"
              :subtitle="labels.SelectRecipientsSub"
            />
            <SendTrainingSelectUsers />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="2">
            <ConfigureCompanyStepHeader
              class="mb-8"
              :title="labels.Settings"
              :subtitle="labels.SendTrainingSettingsSub"
            />
            <SendTrainingSettings />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="3">
            <ConfigureCompanyStepHeader
              class="mb-8"
              :title="labels.Summary"
              :subtitle="labels.SendTrainingSummarySub"
            />
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </template>
    <template #overlay-footer>
      <StepperFooter
        max-step="3"
        :ids="{
          cancelButton: 'btn-cancel--send-training-modal',
          backButton: 'btn-back--send-training-modal',
          saveButton: 'btn-next--send-training-modal'
        }"
        :step="step"
        :disabled-statuses="{
          nextButton: isActionButtonDisabled,
          submitButton: isActionButtonDisabled
        }"
        @on-cancel="handleClose"
        @on-back="changeStep(-1)"
        @on-next="changeStep()"
        @on-submit="handleSubmit"
      />
    </template>
  </AppModal>
</template>

<script>
import AppModal from '@/components/AppModal'
import labels from '@/model/constants/labels'
import { EMITS } from '@/components/AwarenessEducator/utils'
import StepperFooter from '@/components/Stepper/StepperFooter'
import ConfigureCompanyStepHeader from '@/components/Companies/ConfigureCompanyStepHeader'
import SendTrainingSelectUsers from '@/components/AwarenessEducator/SendTraining/SendTrainingSelectUsers'
import SendTrainingSettings from '@/components/AwarenessEducator/SendTraining/SendTrainingSettings'
export default {
  name: 'SendTrainingModal',
  components: {
    SendTrainingSettings,
    SendTrainingSelectUsers,
    ConfigureCompanyStepHeader,
    StepperFooter,
    AppModal
  },
  props: {
    status: {
      type: Boolean
    },
    selectedRow: {
      type: Object
    }
  },
  data() {
    return {
      labels,
      isActionButtonDisabled: false,
      step: 1
    }
  },
  computed: {
    getTitle() {
      return `Send Training - ${this.selectedRow.name}`
    }
  },
  created() {
    if (this.isEdit) {
      //todo call for data
    }
  },
  methods: {
    handleClose() {
      this.$emit(EMITS.ON_CLOSE)
    },
    changeStep(flag = 1) {
      if (this.step === 1 && flag === 1) {
        this.step += flag
      } else {
        this.step += flag
      }
    },
    handleSubmit() {}
  }
}
</script>
