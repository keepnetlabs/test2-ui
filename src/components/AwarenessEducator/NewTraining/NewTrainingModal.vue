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
            id="step--training-add-or-edit-modal-course-info"
            class="k-stepper__step"
            :complete="step > 1"
            :step="1"
            >{{ labels.CourseInfo }}
          </v-stepper-step>
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            id="step--training-add-or-edit-modal-training-content"
            class="k-stepper__step"
            :complete="step > 2"
            :step="2"
            >{{ labels.TrainingContent }}
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items class="k-stepper__items">
          <v-stepper-content class="k-stepper__content" :step="1">
            <ConfigureCompanyStepHeader
              class="mb-8"
              :title="labels.TrainingCourseInformation"
              :subtitle="labels.TrainingCourseInformationSub"
            />
            <NewTrainingCourseInformation ref="refTrainingCourseInformation" />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="2">
            <ConfigureCompanyStepHeader
              class="mb-8"
              :title="labels.TrainingContent"
              :subtitle="labels.TrainingContentSub"
            />
            <NewTrainingTrainingContent />
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </template>
    <template #overlay-footer>
      <StepperFooter
        max-step="2"
        :ids="{
          cancelButton: 'btn-cancel--add-or-edit-training-modal',
          backButton: 'btn-back--add-or-edit-training-modal',
          saveButton: 'btn-next--add-or-edit-training-modal'
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
import { EMITS } from '@/components/AwarenessEducator/utils'
import labels from '@/model/constants/labels'
import ConfigureCompanyStepHeader from '@/components/Companies/ConfigureCompanyStepHeader'
import StepperFooter from '@/components/Stepper/StepperFooter'
import NewTrainingCourseInformation from '@/components/AwarenessEducator/NewTraining/NewTrainingCourseInformation'
import NewTrainingTrainingContent from '@/components/AwarenessEducator/NewTraining/NewTrainingTrainingContent'
import AwarenessEducatorService from '@/api/awarenessEducator'

export default {
  name: 'NewTrainingModal',
  components: {
    NewTrainingTrainingContent,
    NewTrainingCourseInformation,
    StepperFooter,
    ConfigureCompanyStepHeader,
    AppModal
  },
  props: {
    status: {
      type: Boolean
    },
    isEdit: {
      type: Boolean
    },
    selectedRow: {
      type: Object
    },
    isDuplicate: {
      type: Boolean
    }
  },
  data() {
    return {
      labels,
      isActionButtonDisabled: false,
      step: 1,
      trainingId: this?.selectedRow?.resourceId || ''
    }
  },
  computed: {
    getTitle() {
      return !this.isEdit ? labels.CreateNewTrainingContent : labels.EditTrainingContent
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
      const { refTrainingCourseInformation } = this.$refs
      if (this.step === 1 && flag === 1) {
        if (refTrainingCourseInformation.validateForm()) {
          const { formData } = refTrainingCourseInformation
          const { name, description, category, targetAudience, tagNames } = formData
          this.isActionButtonDisabled = true
          AwarenessEducatorService.createDraftTraining({
            name,
            description,
            category,
            targetAudience,
            tagNames
          })
            .then((response) => {
              this.trainingId = response?.data?.data?.trainingId || ''
              this.step++
            })
            .finally(() => {
              this.isActionButtonDisabled = false
            })
        }
      } else {
        this.step += flag
      }
    },
    handleSubmit() {}
  }
}
</script>
