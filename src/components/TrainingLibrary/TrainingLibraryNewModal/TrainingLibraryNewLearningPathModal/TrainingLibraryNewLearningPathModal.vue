<template>
  <AppModal
    :status="status"
    icon-name="mdi-book"
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
            >{{ labels.LearningPathInfo }}
          </v-stepper-step>
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            id="step--training-add-or-edit-modal-training-content"
            class="k-stepper__step"
            :complete="step > 2"
            :step="2"
            >{{ labels.LearningPathContent }}
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items class="k-stepper__items">
          <v-stepper-content class="k-stepper__content" :step="1">
            <ConfigureCompanyStepHeader
              class="mb-8"
              :title="labels.LearningPathInformation"
              :subtitle="labels.LearningPathInformationSub"
            />
            <TrainingLibraryNewLearningPathInformation ref="refTrainingCourseInformation" />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="2">
            <ConfigureCompanyStepHeader
              class="mb-8"
              :title="labels.LearningPathContent"
              :subtitle="labels.LearningPathContentSub"
            />
            <TrainingLibraryNewLearningPathContent
              ref="refTrainingContent"
              :is-action-button-disabled.sync="isActionButtonDisabled"
              :resource-id="trainingId"
              :step="step"
              :is-edit="isEdit"
            />
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
          nextButton: 'btn-next--add-or-edit-training-modal',
          saveButton: 'btn-save--add-or-edit-training-modal'
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
import AppModal from '@/components/AppModal.vue'
import labels from '@/model/constants/labels'
import ConfigureCompanyStepHeader from '@/components/Companies/ConfigureCompanyStepHeader.vue'
import StepperFooter from '@/components/Stepper/StepperFooter.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { mapActions } from 'vuex'
import { emptyNewLearningPathModalObj } from '@/components/TrainingLibrary/utils'
import TrainingLibraryNewLearningPathInformation from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewLearningPathModal/TrainingLibraryNewLearningPathInformation.vue'
import TrainingLibraryNewLearningPathContent from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewLearningPathModal/TrainingLibraryNewLearningPathContent.vue'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

export default {
  name: 'TrainingLibraryNewLearningPathModal',
  components: {
    TrainingLibraryNewLearningPathContent,
    TrainingLibraryNewLearningPathInformation,
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
      return !this.isEdit ? labels.CreateNewLearningPath : labels.EditLearningPath
    }
  },
  created() {
    this.callForLearningPathTrainingLibrary()
    if (this.isEdit) {
      this.trainingId = this.selectedRow.trainingId
      AwarenessEducatorService.getTraining(this.trainingId).then((response) => {
        const {
          coverImageUrl,
          name,
          hasQuiz,
          description,
          tagNames,
          targetAudience,
          trainingContents,
          availableForList,
          category,
          type
        } = response?.data?.data || {}
        const { refTrainingCourseInformation, refTrainingContent } = this.$refs
        if (refTrainingCourseInformation && refTrainingContent) {
          refTrainingCourseInformation.setFormData({
            coverImageUrl,
            name,
            hasQuiz,
            description,
            tags: tagNames,
            targetAudience,
            category
          })
          refTrainingCourseInformation.setMakeAvailableForData(availableForList)
          refTrainingContent.setFormData({ hasQuiz, type })
          refTrainingContent.setTrainingContents(trainingContents)
        }
      })
    }
  },
  methods: {
    ...mapActions({
      setNewLearningPathModal: 'trainingLibrary/setNewLearningPathModal',
      callForLearningPathTrainingLibrary: 'trainingLibrary/callForLearningPathTrainingLibrary'
    }),
    handleClose() {
      this.setNewLearningPathModal(emptyNewLearningPathModalObj)
    },
    changeStep(flag = 1) {
      const { refTrainingCourseInformation, refTrainingContent } = this.$refs
      if (this.step === 1 && flag === 1) {
        const { refMakeAvailableFor } = refTrainingCourseInformation?.$refs || {}
        if (refMakeAvailableFor) {
          refMakeAvailableFor.validateAvailableFor(
            refTrainingCourseInformation.formData.availableForRequests
          )
          if (!refMakeAvailableFor.isAvailableForValid) return
        }
        if (refTrainingCourseInformation.validateForm()) {
          this.step += flag
        }
      } else {
        if (this.step === 2 && flag === -1) {
          this.isActionButtonDisabled = false
        }
        this.step += flag
      }
    },
    handleSubmit() {
      const { refTrainingCourseInformation, refTrainingContent } = this.$refs
      const {
        formData: {
          coverImage,
          name,
          description,
          category,
          targetAudience,
          tags,
          availableForRequests,
          coverImageUrl,
          compliances,
          behaviours
        }
      } = refTrainingCourseInformation
      const {
        formData: { hasQuiz, type }
      } = refTrainingContent
      const payload = new FormData()
      if (coverImageUrl) {
        payload.append('trainingDetail.coverImageUrl', coverImageUrl)
      }
      payload.append('coverImage', coverImage)
      payload.append('trainingDetail.name', name)
      payload.append('trainingDetail.description', description)
      payload.append('trainingDetail.category', category)
      payload.append('trainingDetail.targetAudience', targetAudience)
      payload.append('trainingDetail.hasQuiz', hasQuiz)
      payload.append('trainingDetail.type', TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH)
      tags.map((tag, index) => {
        payload.append(`trainingDetail.tagNames[${index}]`, tag)
      })
      compliances.map((compliance, index) => {
        payload.append(`trainingDetail.compliances[${index}]`, compliance)
      })
      behaviours.map((behaviour, index) => {
        payload.append(`trainingDetail.behaviours[${index}]`, behaviour)
      })
      availableForRequests.map((request, index) => {
        payload.append(`trainingDetail.availableForRequests[${index}].type`, request.type)
        payload.append(
          `trainingDetail.availableForRequests[${index}].resourceId`,
          request.resourceId
        )
      })
      this.isActionButtonDisabled = true
      AwarenessEducatorService.updateTraining(payload, this.trainingId)
        .then(() => {
          this.handleClose()
          this.callForLearningPathTrainingLibrary()
        })
        .finally(() => {
          this.isActionButtonDisabled = false
        })
    }
  }
}
</script>
