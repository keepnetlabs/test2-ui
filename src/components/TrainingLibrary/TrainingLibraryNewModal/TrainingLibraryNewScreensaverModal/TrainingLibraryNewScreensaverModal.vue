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
            >{{ labels.ScreensaverInfo }}
          </v-stepper-step>
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            id="step--training-add-or-edit-modal-training-content"
            class="k-stepper__step"
            :complete="step > 2"
            :step="2"
            >{{ labels.ScreensaverContent }}
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items class="k-stepper__items">
          <v-stepper-content class="k-stepper__content" :step="1">
            <ConfigureCompanyStepHeader
              class="mb-8"
              :title="labels.ScreensaverInformation"
              :subtitle="labels.ScreensaverInformationSub"
            />
            <TrainingLibraryNewScreensaverInformation ref="refTrainingCourseInformation" />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="2">
            <ConfigureCompanyStepHeader
              class="mb-8"
              :title="labels.ScreensaverContent"
              :subtitle="labels.ScreensaverContentSub"
            />
            <TrainingLibraryNewScreensaverContent
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
import AppModal from '@/components/AppModal'
import labels from '@/model/constants/labels'
import ConfigureCompanyStepHeader from '@/components/Companies/ConfigureCompanyStepHeader'
import StepperFooter from '@/components/Stepper/StepperFooter'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { mapActions } from 'vuex'
import { emptyNewScreensaverModalObj } from '@/components/TrainingLibrary/utils'
import TrainingLibraryNewScreensaverInformation from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewScreensaverModal/TrainingLibraryNewScreensaverInformation.vue'
import TrainingLibraryNewScreensaverContent from './TrainingLibraryNewScreensaverContent.vue'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

export default {
  name: 'TrainingLibraryNewScreensaverModal',
  components: {
    TrainingLibraryNewScreensaverContent,
    TrainingLibraryNewScreensaverInformation,
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
      return !this.isEdit ? labels.CreateNewScreensaver : labels.EditScreensaver
    }
  },
  created() {
    if (this.isEdit) {
      this.trainingId = this.selectedRow.trainingId
      AwarenessEducatorService.getTraining(this.trainingId).then((response) => {
        const {
          coverImage,
          name,
          hasQuiz,
          description,
          tagNames,
          targetAudience,
          trainingContents,
          availableForList,
          category,
          type,
          compliances,
          behaviours
        } = response?.data?.data || {}
        const { refTrainingCourseInformation, refTrainingContent } = this.$refs
        if (refTrainingCourseInformation && refTrainingContent) {
          refTrainingCourseInformation.setFormData({
            coverImage,
            name,
            hasQuiz,
            description,
            tags: tagNames,
            targetAudience,
            category,
            compliances: compliances.map(({ complianceId }) => complianceId),
            behaviours: behaviours.map(({ behaviourId }) => behaviourId)
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
      setNewScreensaverModal: 'trainingLibrary/setNewScreensaverModal',
      callForTrainingLibrary: 'trainingLibrary/callForTrainingLibrary'
    }),
    handleClose() {
      this.setNewScreensaverModal(emptyNewScreensaverModalObj)
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
          if (this.isEdit) return this.step++
          if (this.trainingId) {
            if (refTrainingContent) {
              this.isActionButtonDisabled = !refTrainingContent?.formData?.contentByLanguage?.some(
                (content) => content.file && content.languageId
              )
            }
            return this.step++
          }
          const { formData } = refTrainingCourseInformation
          const {
            name,
            description,
            category,
            targetAudience,
            tagNames,
            availableForRequests,
            compliances,
            behaviours
          } = formData
          this.isActionButtonDisabled = true
          AwarenessEducatorService.createDraftTraining({
            name,
            description,
            category,
            targetAudience,
            tagNames,
            availableForRequests,
            type: TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER,
            compliances: compliances.map((compliance) => ({ complianceId: compliance })),
            behaviours: behaviours.map((behaviour) => ({ behaviourId: behaviour }))
          })
            .then((response) => {
              this.trainingId = response?.data?.data?.resourceId || ''
              this.step++
            })
            .finally(() => {
              //checking disability of save button
              if (refTrainingContent) {
                this.isActionButtonDisabled = !refTrainingContent?.formData?.contentByLanguage?.some(
                  (content) => content.file && content.languageId
                )
              } else {
                this.isActionButtonDisabled = false
              }
              if (this.step === 1) {
                this.isActionButtonDisabled = false
              }
            })
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
        formData: { hasQuiz }
      } = refTrainingContent
      const payload = new FormData()
      if (coverImageUrl) {
        payload.append('trainingDetail.coverImageUrl', coverImageUrl)
      }
      payload.append('trainingDetail.vendorId', '68a67ag3-0a3c-4c08-86de-b431425ccc13')
      payload.append('coverImage', coverImage)
      payload.append('trainingDetail.name', name)
      payload.append('trainingDetail.description', description)
      payload.append('trainingDetail.category', category)
      payload.append('trainingDetail.targetAudience', targetAudience)
      payload.append('trainingDetail.hasQuiz', hasQuiz)
      payload.append('trainingDetail.type', TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER)
      tags.map((tag, index) => {
        payload.append(`trainingDetail.tagNames[${index}]`, tag)
      })
      compliances.map((compliance, index) => {
        payload.append(`trainingDetail.compliances[${index}].complianceId`, compliance)
      })
      behaviours.map((behaviour, index) => {
        payload.append(`trainingDetail.behaviours[${index}].behaviourId`, behaviour)
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
          this.callForTrainingLibrary()
        })
        .finally(() => {
          this.isActionButtonDisabled = false
        })
    }
  }
}
</script>
