<template>
  <AppModal
    :status="status"
    icon-name="$qr-code-selected"
    :title="getTitle"
    class-name="add-in-configuration"
    title-id="text--add-or-edit-company-manager-modal-title"
    @closeOverlay="closeOverlay"
  >
    <template #overlay-body>
      <v-stepper v-model="step" class="k-stepper">
        <v-stepper-header class="k-stepper__header">
          <v-stepper-step
            id="step--campaign-manager-add-or-edit-modal-campaign-settings"
            class="k-stepper__step"
            :complete="step > 1"
            :step="1"
            >{{ labels.CampaignSettings }}
          </v-stepper-step>
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            id="step--campaign-manager-add-or-edit-modal-phishing-scenarios"
            class="k-stepper__step"
            :complete="step > 2"
            :step="2"
            >{{ labels.QuishingScenarios }}
          </v-stepper-step>
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            id="step--campaign-manager-add-or-edit-modal-target-audience"
            class="k-stepper__step"
            :complete="step > 3"
            :step="3"
            >{{ labels.TargetAudience }}
          </v-stepper-step>
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            id="step--campaign-manager-add-or-edit-modal-campaign-summary"
            class="k-stepper__step"
            :complete="step > 4"
            :step="4"
            >{{ labels.CampaignSummary }}
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items class="k-stepper__items">
          <v-stepper-content class="k-stepper__content" :step="1">
            <ConfigureCompanyStepHeader
              class="mb-8"
              :title="labels.QuishingCampaignSettings"
              :subtitle="labels.PhishingCampaignSettingsSub"
            />
            <CampaignManagerPrintoutCampaignInfo
              ref="refCampaignManagerCampaignInfo"
              :default-values="getDefaultValuesOfCampaignInfo"
              :is-edit="isEdit"
              :isDuplicate="isDuplicate"
              :is-action-button-disabled.sync="isActionButtonDisabled"
              @initialFormValues="getInitialCampaignManagerCampaignInfo"
            />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="2">
            <ConfigureCompanyStepHeader
              class="mb-8"
              :title="labels.QuishingScenarios"
              :subtitle="labels.CampaignManagerQuishingIndividualPrintoutScenariosSub"
            />
            <CampaignManagerPrintOutPhishingScenarios
              v-model="selectedPhishingScenarios"
              ref="refCampaignManagerPhishingScenarios"
              is-single
              :type="SCENARIO_TYPES.QUISHING"
              :campaign-manager-resource-id="getCampaignResourceId"
              :is-edit="isEdit || isDuplicate"
              :languages="languageOptions"
              :default-phishing-scenarios-values-mapped="getDefaultValuesOfPhishingScenarios"
              :is-valid="isPhishingScenariosValid"
            />
            <CustomError class="mb-6 ml-2" :is-valid="isPhishingScenariosValid" />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="3">
            <ConfigureCompanyStepHeader
              class="mb-8"
              :title="labels.TargetAudience"
              :subtitle="labels.CampaignManagerTargetAudienceSub"
            />
            <CampaignManagerTargetAudience
              ref="refCampaignManagerTargetAudience"
              is-quishing-print-out
              :is-multiple-phishing-scenarios="selectedPhishingScenarios.length > 1"
              :is-all-groups="!isEdit"
              :default-values="getDefaultTargetAudienceSettings"
              :selected-target-groups.sync="selectedTargetGroups"
              :selected-target-groups-mapped.sync="selectedTargetGroupsMapped"
              :total-target-user-count="getTotalTargetUserCountForTargetAudience"
              :default-selected-target-group-resource-ids="defaultTargetGroupResourceIds"
              :form-details="formDetails"
              :is-call-api-when-created="!isEdit"
            />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="4">
            <ConfigureCompanyStepHeader
              :title="labels.CampaignSummary"
              :subtitle="labels.CampaignSummarySub"
            />
            <CampaignManagerPrintoutSummary
              ref="refCampaignManagerSummary"
              :type="SCENARIO_TYPES.QUISHING"
              :form-data="getFormDataForCampaignSummary"
              :language-options="languageOptions"
            />
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </template>
    <template #overlay-footer>
      <StepperFooter
        max-step="4"
        :ids="stepperIds"
        :step="step"
        :disabled-statuses="{
          nextButton: isActionButtonDisabled,
          submitButton: isActionButtonDisabled
        }"
        :save-button-text="getSaveButtonText"
        @on-cancel="closeOverlay"
        @on-back="changeStep(-1)"
        @on-next="handleSubmit"
        @on-submit="handleSubmit"
      />
    </template>
  </AppModal>
</template>

<script>
import AppModal from '@/components/AppModal'
import labels from '@/model/constants/labels'
import ConfigureCompanyStepHeader from '@/components/Companies/ConfigureCompanyStepHeader'
import { isDifferent } from '@/utils/functions'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import StepperFooter from '@/components/Stepper/StepperFooter'
import { getTargetGroupCountDetail } from '@/api/targetUsers'
import CustomError from '@/components/CustomError.vue'
import CampaignManagerTargetAudience from '@/components/CampaignManager/TargetAudience/CampaignManagerTargetAudience'
import QuishingService from '@/api/quishing'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
import CampaignManagerPrintoutCampaignInfo from '@/components/CampaignManager/CampaignManagerInfo/CampaignManagerPrintoutCampaignInfo.vue'
import CampaignManagerPrintOutPhishingScenarios from '@/components/CampaignManager/PhishingScenarios/CampaignManagerPrintOutPhishingScenarios.vue'
import CampaignManagerPrintoutSummary from '@/components/CampaignManager/Summary/CampaignManagerPrintoutSummary.vue'
import { SCHEDULE_TYPES } from '@/components/CampaignManager/utils'
import { DISTRIBUTION_TYPES } from '@/components/SmishingCampaignManager/utils'
const EMITS = {
  ON_CLOSE: 'on-close',
  ON_SUBMIT: 'on-submit'
}
export default {
  name: 'QuishingCampaignManagerPrintoutAddOrEditModal',
  components: {
    CampaignManagerPrintoutSummary,
    CampaignManagerPrintOutPhishingScenarios,
    CampaignManagerPrintoutCampaignInfo,
    CampaignManagerTargetAudience,
    CustomError,
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
    formDetails: {
      type: Object
    },
    isDuplicate: {
      type: Boolean
    }
  },
  emits: EMITS,
  data() {
    return {
      SCENARIO_TYPES,
      stepperIds: {
        cancelButton: 'btn-cancel--add-or-edit-company-manager-modal',
        backButton: 'btn-back--add-or-edit-company-manager-modal',
        nextButton: 'btn-next--add-or-edit-company-manager-modal',
        saveButton: 'btn-save--add-or-edit-company-manager-modal'
      },
      isActionButtonDisabled: false,
      isPhishingScenariosValid: true,
      labels,
      totalTargetUserCount: 0,
      step: 1,
      selectedRowFormData: {},
      initialFormValues: {},
      languageOptions: [],
      userCountDetailResponse: {},
      selectedTargetGroupsMapped: [],
      selectedTargetGroups: [],
      selectedPhishingScenarios: [],
      defaultTargetGroupResourceIds: [],
      selectedSchedule: ''
    }
  },
  computed: {
    getTotalTargetUserCountForTargetAudience() {
      if (Object.keys(this.userCountDetailResponse)?.length) return this.totalTargetUserCount
      return this.selectedTargetGroupsMapped.reduce(
        (acc, group) => acc + group?.extraDatas?.userCount,
        0
      )
    },
    getCampaignResourceId() {
      return this.selectedRow?.resourceId || ''
    },
    getTitle() {
      const text = this.isEdit ? labels.Edit : labels.New
      return `${text} Quishing Individual Printout Campaign`
    },
    getSaveButtonText() {
      return [1, 2, 3].includes(this.step) ? labels.Next : labels.Launch
    },
    targetGroupResourceIds() {
      return this.selectedTargetGroupsMapped.map((group) => group.value)
    },
    getSelectedPhishingScenario() {
      let selectedScenario = {}
      if (this.step === 4) {
        const { refCampaignManagerPhishingScenarios } = this.$refs
        selectedScenario = refCampaignManagerPhishingScenarios?.emailTemplateParams || {}
        selectedScenario.template = refCampaignManagerPhishingScenarios?.emailTemplate || ''
      }
      return selectedScenario
    },
    getFormDataForCampaignSummary() {
      let formData = {}
      if (this.step === 4) {
        const {
          refCampaignManagerCampaignInfo,
          refCampaignManagerTargetAudience,
          refCampaignManagerPhishingScenarios
        } = this.$refs
        formData.userCountDetailResponse = this.userCountDetailResponse
        formData.duration = refCampaignManagerCampaignInfo.formData.duration
        formData.excludeFromReports = refCampaignManagerCampaignInfo.formData.excludeFromReports
        formData.sendOnlyActiveUsers = refCampaignManagerTargetAudience.formData.sendOnlyActiveUsers
        formData.sendRandomlyUsers = refCampaignManagerTargetAudience.formData.sendRandomlyUsers
        formData.name = refCampaignManagerCampaignInfo.formData.name
        formData.sendRandomlyUsersCount =
          refCampaignManagerTargetAudience.formData.sendRandomlyUsersCount
        formData.sendRandomlyUsersCalculateTypeId =
          refCampaignManagerTargetAudience.formData.sendRandomlyUsersCalculateTypeId
        formData.targetGroupResourceIds = this.targetGroupResourceIds
        formData.selectedTargetGroups = this.selectedTargetGroups
        formData.selectedPhishingScenarios = this.selectedPhishingScenarios
        formData.trainings = refCampaignManagerPhishingScenarios?.trainingTabModel
        formData.scheduledDate = this.selectedSchedule
        formData.templateType = this.getSelectedPhishingScenario?.type
      }
      return formData
    },
    getDefaultValuesOfCampaignInfo() {
      const keys = Object.keys(this.selectedRowFormData)
      if (!keys.length) return {}
      const {
        name,
        duration,
        excludeFromReports,
        scheduleTypeId,
        scheduledDate,
        scheduledDateTimeZoneId
      } = this.selectedRowFormData
      return {
        name,
        duration,
        excludeFromReports,
        scheduleTypeId: '3',
        scheduledDate,
        scheduledDateTimeZoneId
      }
    },
    getDefaultValuesOfPhishingScenarios() {
      return this?.selectedRowFormData?.phishingScenarios || []
    },
    getDefaultTargetAudienceSettings() {
      const keys = Object.keys(this.selectedRowFormData)
      if (!keys.length) return {}
      const {
        sendOnlyActiveUsers,
        sendRandomlyUsers,
        sendRandomlyUsersCount,
        sendRandomlyUsersCalculateTypeId
      } = this.selectedRowFormData

      return {
        sendOnlyActiveUsers,
        sendRandomlyUsers,
        sendRandomlyUsersCount,
        sendRandomlyUsersCalculateTypeId: sendRandomlyUsersCalculateTypeId.toString()
      }
    }
  },
  watch: {
    selectedPhishingScenarios(val) {
      this.isPhishingScenariosValid = !!val.length
    }
  },
  created() {
    this.callForLanguages()
    if (this.selectedRow) this.callForData()
  },
  mounted() {
    this.initialFormValues = this.getFormValues()
  },
  methods: {
    callForLanguages() {
      LookupLocalStorage.getSingle(21).then((response) => {
        this.languageOptions =
          response?.map((language) => ({
            text: language.description,
            value: language.resourceId
          })) || []
      })
    },
    getInitialCampaignManagerCampaignInfo(values) {
      this.initialFormValues = { ...this.initialFormValues, ...values }
    },
    callForData() {
      QuishingService.getCampaignManager(this.getCampaignResourceId).then((response) => {
        const { data: { data = {} } = {} } = response
        if (this.isDuplicate) {
          data.name = `${data.name} - Copy`
        }
        data.phishingScenarios = data.quishingScenarios
        delete data.quishingScenarios
        this.selectedRowFormData = data
        this.selectedTargetGroups = data.targetGroups.map((tGroup) => ({
          name: tGroup.text,
          resourceId: tGroup.value
        }))
        this.defaultTargetGroupResourceIds = data.targetGroups.map((tGroup) => tGroup.value)
        this.selectedTargetGroupsMapped = this.selectedTargetGroups
        if (
          this.$refs?.refCampaignManagerTargetAudience?.$refs?.refCampaignManagerTargetGroup?.$refs
            ?.refGroupTable?.$refs?.refTable
        ) {
          this.$refs?.refCampaignManagerTargetAudience?.$refs?.refCampaignManagerTargetGroup?.$refs.refGroupTable.callForData()
          this.$refs.refCampaignManagerTargetAudience.$refs.refCampaignManagerTargetGroup.$refs.refGroupTable.$refs.refTable.getSelectedObjectAndSelectRowsByRowKey(
            this.selectedTargetGroups
          )
        }
      })
    },
    getFormValues() {
      const {
        refCampaignManagerCampaignInfo: { formData: campaignManagerFormData }
      } = this.$refs
      return { ...campaignManagerFormData }
    },
    closeOverlay() {
      const currentFormValues = this.getFormValues()
      const isChanged = isDifferent(currentFormValues, this.initialFormValues)
      if (!isChanged) {
        return this.$emit(EMITS.ON_CLOSE)
      }
      this.$store.dispatch('common/setIsShowLeavingDialog', {
        show: true,
        callback: () => {
          this.$emit(EMITS.ON_CLOSE)
        }
      })
    },
    changeStep(flag = 1) {
      this.step += flag
    },
    setActionButtonDisability(flag = false) {
      this.isActionButtonDisabled = flag
    },
    async handleSubmit() {
      switch (this.step) {
        case 1:
          const { refCampaignManagerCampaignInfo } = this.$refs
          if (!refCampaignManagerCampaignInfo.validateForm()) return
          this.changeStep()
          return
        case 2:
          const {
            refCampaignManagerPhishingScenarios,
            refCampaignManagerCampaignInfo: { inputScheduleFormData }
          } = this.$refs
          this.isPhishingScenariosValid = !!this.selectedPhishingScenarios.length
          if (!this.isPhishingScenariosValid) return
          //if languages empty set all languages
          refCampaignManagerPhishingScenarios?.adjustTrainingModel(
            refCampaignManagerPhishingScenarios.selectedTemplateResourceId
          )
          const response = await QuishingService.calculateScheduleInfo({
            scheduleTypeId: inputScheduleFormData?.scheduleTypeId,
            scheduledDate: inputScheduleFormData?.scheduledDate,
            scheduledDateTimeZoneId: inputScheduleFormData?.scheduledDateTimeZoneId,
            quishingScenarioResourceIds: this.selectedPhishingScenarios.map(
              (pScenario) => pScenario.resourceId
            )
          })
          if (inputScheduleFormData?.scheduleTypeId === SCHEDULE_TYPES.SAVE_FOR_LATER)
            this.selectedSchedule = labels.Later
          else {
            this.selectedSchedule = response?.data?.data?.isStarting
              ? labels.Now
              : `${inputScheduleFormData?.scheduledDate}`
          }
          this.changeStep()
          return
        case 3:
          const { refCampaignManagerTargetAudience } = this.$refs
          this.setActionButtonDisability(true)
          const totalTargetUserCount = this.selectedTargetGroupsMapped.reduce((acc, item) => {
            acc += item?.extraDatas.userCount || 0
            return acc
          }, 0)
          if (totalTargetUserCount) {
            refCampaignManagerTargetAudience.isShowTargetGroupUsersError = false
            refCampaignManagerTargetAudience.isTargetGroupsValid = true
            this.userCountDetailResponse = await getTargetGroupCountDetail(
              this.targetGroupResourceIds
            )
            if (
              this.userCountDetailResponse?.data?.data &&
              this.userCountDetailResponse?.data?.data?.length
            ) {
              this.totalTargetUserCount = this.userCountDetailResponse?.data?.data?.reduce(
                (acc, row) => {
                  if (row.status !== 'Active') return acc
                  const verifiedUserCount =
                    row?.domainAllowList?.find((r) => r.status === 'Verified')?.count || 0
                  return acc + verifiedUserCount
                },
                0
              )
            }
            if (refCampaignManagerTargetAudience?.$refs?.refForm?.validate()) this.changeStep()
          } else {
            refCampaignManagerTargetAudience.isShowTargetGroupUsersError = true
            refCampaignManagerTargetAudience.isTargetGroupsValid = false
          }
          this.setActionButtonDisability(false)
          return
        case 4:
          let {
            refCampaignManagerCampaignInfo: {
              formData: campaignManagerFormData,
              inputScheduleFormData: scheduleFormData
            },
            refCampaignManagerTargetAudience: { formData: targetAudienceFormData },
            refCampaignManagerPhishingScenarios: { trainingTabModel }
          } = this.$refs
          const quishingScenarios = []
          Object.keys(trainingTabModel).forEach((phishingScenarioResourceId) => {
            const {
              trainingId,
              trainingLanguageIds,
              isCheckboxSelected,
              enrollmentReminder,
              awardCertificate,
              enrollmentSendTypeId
            } = trainingTabModel[phishingScenarioResourceId]
            if (!isCheckboxSelected) return
            const { sendReminderEvery } = enrollmentReminder
            const enrollmentReminderEveryValue = sendReminderEvery
            delete enrollmentReminder.sendReminderEvery
            if (!isCheckboxSelected) return
            quishingScenarios.push({
              trainingId,
              trainingLanguageIds: trainingLanguageIds.filter((lang) => lang !== labels.All),
              quishingScenarioResourceId: phishingScenarioResourceId,
              enrollmentReminder: enrollmentReminderEveryValue ? enrollmentReminder : null,
              awardCertificate,
              enrollmentSendTypeId
            })
          })
          const payload = {
            quishingScenarios,
            targetGroupResourceIds: this.targetGroupResourceIds,
            name: campaignManagerFormData.name,
            excludeFromReports: campaignManagerFormData.excludeFromReports,
            duration: campaignManagerFormData.duration,
            sendOnlyActiveUsers: targetAudienceFormData.sendOnlyActiveUsers,
            sendRandomlyUsers: targetAudienceFormData.sendRandomlyUsers,
            sendRandomlyUsersCount: targetAudienceFormData.sendRandomlyUsersCount,
            sendRandomlyUsersCalculateTypeId:
              targetAudienceFormData.sendRandomlyUsersCalculateTypeId,
            scheduleTypeId: parseInt(scheduleFormData.scheduleTypeId),
            scheduledDate:
              scheduleFormData?.scheduleTypeId?.toString() !== SCHEDULE_TYPES.SCHEDULE_TO
                ? null
                : scheduleFormData.scheduledDate,
            scheduledDateTimeZoneId:
              scheduleFormData?.scheduleTypeId?.toString() !== SCHEDULE_TYPES.SCHEDULE_TO
                ? null
                : scheduleFormData.scheduledDateTimeZoneId,
            distributionTypeId: DISTRIBUTION_TYPES.QUISHING_INDIVIDUAL_PRINTOUT,
            distributionDelayEvery: 20,
            distributionDelayTimeTypeId: '1',
            distributionEmailOver: 8,
            distributionEmailOverTimeTypeId: '1',
            sendingLimit: 50
          }
          this.setActionButtonDisability(true)
          if (this.isEdit) {
            QuishingService.updateCampaignManager(this.getCampaignResourceId, payload)
              .then(() => {
                this.$emit(EMITS.ON_SUBMIT)
              })
              .finally(this.setActionButtonDisability)
          } else {
            QuishingService.createCampaignManager(payload)
              .then(() => {
                this.$emit(EMITS.ON_SUBMIT)
              })
              .finally(this.setActionButtonDisability)
          }
          return
        default:
          break
      }
    }
  }
}
</script>
