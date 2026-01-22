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
            >{{ labels.InfographicInfo }}
          </v-stepper-step>
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            id="step--training-add-or-edit-modal-training-content"
            class="k-stepper__step"
            :complete="step > 2"
            :step="2"
            >{{ labels.InfographicContent }}
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items class="k-stepper__items">
          <v-stepper-content class="k-stepper__content" :step="1">
            <ConfigureCompanyStepHeader
              class="mb-8"
              :title="labels.InfographicInformation"
              :subtitle="labels.InfographicInformationSub"
            />
            <TrainingLibraryNewInfographicInformation
              ref="refTrainingCourseInformation"
              :selectedCompaniesAndGroups="selectedCompaniesAndGroups"
              @generating-changed="handleGeneratingChanged"
            />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="2">
            <ConfigureCompanyStepHeader
              class="mb-8"
              :title="labels.InfographicContent"
              :subtitle="labels.InfographicContentSub"
            />
            <TrainingLibraryNewInfographicContent
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
          nextButton: isActionButtonDisabled || isGenerating,
          submitButton: isActionButtonDisabled || isGenerating
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
import { emptyNewInfographicModalObj } from '@/components/TrainingLibrary/utils'
import TrainingLibraryNewInfographicInformation from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewInfographicModal/TrainingLibraryNewInfographicInformation.vue'
import TrainingLibraryNewInfographicContent from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewInfographicModal/TrainingLibraryNewInfographicContent.vue'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import { normalizeRoleId } from '@/utils/helperFunctions'

export default {
  name: 'TrainingLibraryNewInfographicModal',
  components: {
    TrainingLibraryNewInfographicContent,
    TrainingLibraryNewInfographicInformation,
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
      isGenerating: false,
      step: 1,
      trainingId: this?.selectedRow?.resourceId || '',
      selectedCompaniesAndGroups: []
    }
  },
  computed: {
    getTitle() {
      return !this.isEdit ? labels.CreateNewInfographic : labels.EditInfographic
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
          roleIds,
          trainingRoles,
          trainingContents,
          availableForList,
          category,
          type,
          compliances,
          behaviours,
          vendorId
        } = response?.data?.data || {}
        const { refTrainingCourseInformation, refTrainingContent } = this.$refs
        if (refTrainingCourseInformation && refTrainingContent) {
          // Backward compatibility: if trainingRoles is empty but targetAudience exists, use targetAudience
          let resolvedRoleIds = []
          if (trainingRoles?.length) {
            resolvedRoleIds = trainingRoles.map(normalizeRoleId).filter(Boolean)
          } else if (roleIds?.length) {
            resolvedRoleIds = roleIds.map(normalizeRoleId).filter(Boolean)
          } else if (targetAudience) {
            resolvedRoleIds = [normalizeRoleId(targetAudience)].filter(Boolean)
          }
          refTrainingCourseInformation.setFormData({
            coverImage,
            name,
            hasQuiz,
            description,
            tags: tagNames,
            roleIds: resolvedRoleIds,
            category,
            compliances: compliances.map(({ complianceId }) => complianceId),
            behaviours: behaviours.map(({ behaviourId }) => behaviourId)
          })
          refTrainingCourseInformation.setMakeAvailableForData(availableForList)
          refTrainingContent.setFormData({ hasQuiz, type, vendorId })
          refTrainingContent.setTrainingContents(trainingContents)
          this.selectedCompaniesAndGroups = availableForList
            .map((af) => {
              if (['MyCompanyOnly', 'AllCompanies'].includes(af.typeName)) {
                return null
              }
              return { resourceId: af.targetResourceId, typeName: af.typeName }
            })
            .filter(Boolean)
        }
      })
    }
  },
  methods: {
    ...mapActions({
      setNewInfographicModal: 'trainingLibrary/setNewInfographicModal',
      callForTrainingLibrary: 'trainingLibrary/callForTrainingLibrary'
    }),
    handleClose() {
      this.setNewInfographicModal(emptyNewInfographicModalObj)
    },
    handleGeneratingChanged(isGenerating) {
      this.isGenerating = isGenerating
    },
    async changeStep(flag = 1) {
      const { refTrainingCourseInformation, refTrainingContent } = this.$refs
      if (this.step === 1 && flag === 1) {
        const { refMakeAvailableFor } = refTrainingCourseInformation?.$refs || {}
        if (refMakeAvailableFor) {
          refMakeAvailableFor.validateAvailableFor(
            refTrainingCourseInformation.formData.availableForRequests
          )
          if (!refMakeAvailableFor.isAvailableForValid) return
        }
        // Generate description if needed before validation
        if (refTrainingCourseInformation.generateDescriptionIfNeeded) {
          await refTrainingCourseInformation.generateDescriptionIfNeeded()
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
            roleIds,
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
            roleIds,
            tagNames,
            availableForRequests,
            type: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC,
            compliances: compliances.map((compliance) => ({
              complianceId: compliance
            })),
            behaviours: behaviours.map((behaviour) => ({
              behaviourId: behaviour
            }))
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
          roleIds,
          tags,
          availableForRequests,
          coverImageUrl,
          compliances,
          behaviours
        }
      } = refTrainingCourseInformation
      const {
        formData: { hasQuiz, vendorId }
      } = refTrainingContent
      const payload = new FormData()
      if (coverImageUrl) {
        payload.append('trainingDetail.coverImageUrl', coverImageUrl)
      }
      payload.append('coverImage', coverImage)
      payload.append('trainingDetail.name', name)
      payload.append('trainingDetail.description', description)
      payload.append('trainingDetail.category', category)
      roleIds.forEach((roleId, index) => {
        payload.append(`trainingDetail.RoleIds[${index}]`, roleId)
      })
      payload.append('trainingDetail.hasQuiz', hasQuiz)
      payload.append('trainingDetail.type', TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC)
      if (vendorId) payload.append('trainingDetail.vendorId', vendorId)
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
