<template>
  <Fragment>
    <TrainingLibraryNewLearningPathCannotSaveModal
      v-if="isCannotSaveModalActive"
      :status="isCannotSaveModalActive"
      @closeOverlay="toggleCannotSaveModal"
    />
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
                ref="refLearningPathContent"
                :is-action-button-disabled.sync="isActionButtonDisabled"
                :resource-id="trainingId"
                :step="step"
                :is-edit="isEdit"
                :availableForRequests="availableForRequestIds"
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
  </Fragment>
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
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import TrainingLibraryNewLearningPathCannotSaveModal from './TrainingLibraryNewLearningPathCannotSaveModal'
import { Fragment } from 'vue-frag'
export default {
  name: 'TrainingLibraryNewLearningPathModal',
  components: {
    TrainingLibraryNewLearningPathContent,
    TrainingLibraryNewLearningPathInformation,
    TrainingLibraryNewLearningPathCannotSaveModal,
    StepperFooter,
    ConfigureCompanyStepHeader,
    AppModal,
    Fragment
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
      isCannotSaveModalActive: false,
      labels,
      isActionButtonDisabled: false,
      step: 1,
      trainingId: this?.selectedRow?.resourceId || '',
      availableForRequestIds: [],
      trainingIds: []
    }
  },
  computed: {
    getTitle() {
      return !this.isEdit ? labels.CreateNewLearningPath : labels.EditLearningPath
    }
  },
  created() {
    if (this.isEdit) {
      AwarenessEducatorService.getTraining(this.selectedRow.trainingId)
        .then((response) => {
          const {
            availableForList,
            behaviours,
            category,
            compliances,
            description,
            name,
            tagNames,
            targetAudience,
            coverImage,
            trainingGroups
          } = response?.data?.data || {}
          const { refTrainingCourseInformation, refLearningPathContent } = this.$refs
          if (refTrainingCourseInformation && refLearningPathContent) {
            refTrainingCourseInformation.setFormData({
              behaviours: behaviours.map((b) => b.behaviourId),
              category,
              compliances: compliances.map((c) => c.complianceId),
              description,
              name,
              tags: tagNames,
              targetAudience,
              coverImage,
              targetAudience
            })
            refTrainingCourseInformation.setMakeAvailableForData(availableForList)
            refLearningPathContent.setSelectedTrainings(trainingGroups)
            this.trainingIds = trainingGroups.map(
              (training) => training?.trainingId || training?.detailTrainingId
            )
          }
        })
        .then(() => {
          this.callForLearningPathTrainingLibrary({
            trainingIds: this.trainingIds,
            isAppend: false
          })
        })
    } else {
      this.callForLearningPathTrainingLibrary()
    }
  },
  methods: {
    ...mapActions({
      setNewLearningPathModal: 'trainingLibrary/setNewLearningPathModal',
      callForTrainingLibrary: 'trainingLibrary/callForTrainingLibrary',
      callForLearningPathTrainingLibrary: 'learningPath/callForLearningPathTrainingLibrary'
    }),
    toggleCannotSaveModal() {
      this.isCannotSaveModalActive = !this.isCannotSaveModalActive
    },
    handleClose() {
      this.setNewLearningPathModal(emptyNewLearningPathModalObj)
    },
    changeStep(flag = 1) {
      const { refTrainingCourseInformation } = this.$refs
      if (this.step === 1 && flag === 1) {
        const { refMakeAvailableFor } = refTrainingCourseInformation?.$refs || {}
        if (refMakeAvailableFor) {
          refMakeAvailableFor.validateAvailableFor(
            refTrainingCourseInformation.formData.availableForRequests
          )
          if (!refMakeAvailableFor.isAvailableForValid) return
          this.availableForRequestIds = refTrainingCourseInformation.formData.availableForRequests.map(
            (item) => item.id
          )
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
      const { refTrainingCourseInformation, refLearningPathContent } = this.$refs
      const { getSelectedTrainings } = refLearningPathContent
      if (getSelectedTrainings?.length < 2) {
        this.$store.dispatch('common/createSnackBar', {
          message:
            'The learning path has not been saved. Please add at least two training materials before proceeding.',
          color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
          icon: 'mdi-alert'
        })
        return
      }
      if (document.getElementsByClassName('learning-path-content__training--disabled').length) {
        this.toggleCannotSaveModal()
        return
      }
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
      const payload = new FormData()
      if (this.isEdit) {
        if (coverImageUrl) {
          payload.append('TrainingDetail.coverImageUrl', coverImageUrl)
        }
        payload.append('coverImage', coverImage)
        payload.append('TrainingDetail.name', name)
        payload.append('TrainingDetail.description', description)
        payload.append('TrainingDetail.category', category)
        payload.append('TrainingDetail.targetAudience', targetAudience)
        payload.append('TrainingDetail.type', TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH)
        tags.map((tag, index) => {
          payload.append(`TrainingDetail.tagNames[${index}]`, tag)
        })
        compliances.map((compliance, index) => {
          payload.append(`TrainingDetail.compliances[${index}].complianceId`, compliance)
        })
        behaviours.map((behaviour, index) => {
          payload.append(`TrainingDetail.behaviours[${index}].behaviourId`, behaviour)
        })
        availableForRequests.map((request, index) => {
          payload.append(`TrainingDetail.availableForRequests[${index}].type`, request.type)
          payload.append(
            `TrainingDetail.availableForRequests[${index}].resourceId`,
            request.resourceId
          )
        })
        getSelectedTrainings.map((training, index) => {
          payload.append(
            `TrainingDetail.trainingGroups[${index}].detailTrainingId`,
            training.trainingId || training.detailTrainingId
          )
          payload.append(`TrainingDetail.trainingGroups[${index}].trainingOrder`, index + 1)
        })
        this.isActionButtonDisabled = true
        AwarenessEducatorService.updateTraining(payload, this.selectedRow.trainingId)
          .then(() => {
            this.handleClose()
            this.callForTrainingLibrary()
          })
          .finally(() => {
            this.isActionButtonDisabled = false
          })
      } else {
        if (coverImageUrl) {
          payload.append('coverImageUrl', coverImageUrl)
        }
        payload.append('coverImage', coverImage)
        payload.append('name', name)
        payload.append('description', description)
        payload.append('category', category)
        payload.append('targetAudience', targetAudience)
        payload.append('type', TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH)
        tags.map((tag, index) => {
          payload.append(`tagNames[${index}]`, tag)
        })
        compliances.map((compliance, index) => {
          payload.append(`compliances[${index}].complianceId`, compliance)
        })
        behaviours.map((behaviour, index) => {
          payload.append(`behaviours[${index}].behaviourId`, behaviour)
        })
        availableForRequests.map((request, index) => {
          payload.append(`availableForRequests[${index}].type`, request.type)
          payload.append(`availableForRequests[${index}].resourceId`, request.resourceId)
        })
        getSelectedTrainings.map((training, index) => {
          payload.append(
            `trainingGroups[${index}].detailTrainingId`,
            training.trainingId || training.detailTrainingId
          )
          payload.append(`trainingGroups[${index}].trainingOrder`, index + 1)
        })
        this.isActionButtonDisabled = true
        AwarenessEducatorService.createTraining(payload)
          .then(() => {
            this.handleClose()
            this.callForTrainingLibrary()
          })
          .finally(() => {
            this.isActionButtonDisabled = false
          })
      }
    }
  }
}
</script>
