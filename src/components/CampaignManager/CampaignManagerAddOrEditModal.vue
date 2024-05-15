<template>
  <AppModal
    :status="status"
    icon-name="mdi-hook"
    :title="getTitle"
    class-name="add-in-configuration"
    title-id="text--add-or-edit-company-manager-modal-title"
    @closeOverlay="closeOverlay"
  >
    <template #overlay-body>
      <DefaultErrorDialog
        v-if="!!createErrorMessage"
        :status="!!createErrorMessage"
        :error-message="createErrorMessage"
        @on-close="createErrorMessage = ''"
      />
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
            >{{ labels.PhishingScenarios }}
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
            >{{ labels.DeliverySettings }}
          </v-stepper-step>
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            id="step--campaign-manager-add-or-edit-modal-campaign-summary"
            class="k-stepper__step"
            :complete="step > 5"
            :step="5"
            >{{ labels.CampaignSummary }}
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items class="k-stepper__items">
          <v-stepper-content class="k-stepper__content" :step="1">
            <ConfigureCompanyStepHeader
              class="mb-8"
              :title="labels.PhishingCampaignSettings"
              :subtitle="labels.PhishingCampaignSettingsSub"
            />
            <CampaignManagerCampaignInfo
              ref="refCampaignManagerCampaignInfo"
              :default-values="getDefaultValuesOfCampaignInfo"
              :is-edit="isEdit"
              :is-action-button-disabled.sync="isActionButtonDisabled"
              @initialFormValues="getInitialCampaignManagerCampaignInfo"
            />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="2">
            <ConfigureCompanyStepHeader
              class="mb-8"
              :title="labels.PhishingScenarios"
              :subtitle="labels.CampaignManagerPhishingScenariosSub"
            />
            <CampaignManagerPhishingScenarios
              v-model="selectedPhishingScenarios"
              ref="refCampaignManagerPhishingScenarios"
              is-show-reminder
              :campaign-manager-resource-id="getCampaignResourceId"
              :is-edit="isEdit || isDuplicate"
              :languages="languageOptions"
              :default-phishing-scenarios-values-mapped="getDefaultValuesOfPhishingScenarios"
              :is-valid="isPhishingScenariosValid"
              :categories="categories"
              @distributionChanged="handleDistributionChanged"
            />
            <CustomError
              class="mb-6 ml-2"
              :is-valid="
                isPhishingScenariosValid || scenarioDistribution !== SCENARIO_DISTRIBUTION.MANUALLY
              "
            />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="3">
            <ConfigureCompanyStepHeader
              class="mb-8"
              :title="labels.TargetAudience"
              :subtitle="labels.CampaignManagerTargetAudienceSub"
            />
            <CampaignManagerTargetAudience
              ref="refCampaignManagerTargetAudience"
              :is-multiple-phishing-scenarios="selectedPhishingScenarios.length > 1"
              :is-all-groups="!isEdit"
              :default-values="getDefaultTargetAudienceSettings"
              :selected-target-groups.sync="selectedTargetGroups"
              :selected-target-groups-mapped.sync="selectedTargetGroupsMapped"
              :total-target-user-count="getTotalTargetUserCountForTargetAudience"
              :default-selected-target-group-resource-ids="defaultTargetGroupResourceIds"
              :form-details="formDetails"
              :is-call-api-when-created="!isEdit"
              :isMFAScenarioSelected="isMFAScenarioSelected"
            />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="4">
            <ConfigureCompanyStepHeader
              :title="labels.DeliverySettings"
              :subtitle="labels.DeliverySettingsSub"
            />
            <CampaignManagerDeliverySettings
              ref="refCampaignManagerDeliverySettings"
              :default-values="getDefaultValuesDeliverySettings"
              :form-details="formDetails"
              :target-group-resource-ids="targetGroupResourceIds"
              :total-target-user-count="totalTargetUserCount"
              :user-target-audience-data="getUserTargetAudienceData"
              :selected-phishing-scenario="getSelectedPhishingScenario"
              :is-edit="isEdit"
              :targetGroupCompanyNames="targetGroupCompanyNames"
              @set-action-button-disability="setActionButtonDisability"
            />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="5">
            <ConfigureCompanyStepHeader
              :title="labels.CampaignSummary"
              :subtitle="labels.CampaignSummarySub"
            />
            <CampaignManagerSummary
              ref="refCampaignManagerSummary"
              :isMFAScenarioSelected="isMFAScenarioSelected"
              :show-schedule="showSchedule"
              :form-data="getFormDataForCampaignSummary"
              :language-options="languageOptions"
            />
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </template>
    <template #overlay-footer>
      <StepperFooter
        max-step="5"
        :ids="{
          cancelButton: 'btn-cancel--add-or-edit-company-manager-modal',
          backButton: 'btn-back--add-or-edit-company-manager-modal',
          nextButton: 'btn-next--add-or-edit-company-manager-modal',
          saveButton: 'btn-save--add-or-edit-company-manager-modal'
        }"
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
import CampaignManagerCampaignInfo from '@/components/CampaignManager/CampaignManagerInfo/CampaignManagerCampaignInfo'
import { getTimeZoneForMoment, isDifferent } from '@/utils/functions'
import CampaignManagerSummary from '@/components/CampaignManager/Summary/CampaignManagerSummary'
import {
  createCampaignManager,
  getCalculatedScheduleInfo,
  getCampaignManager,
  updateCampaignManager
} from '@/api/phishingsimulator'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import StepperFooter from '@/components/Stepper/StepperFooter'
import { EMAIL_DELIVERY_TYPES } from '@/components/CampaignManager/AdvancedSettings/utils'
import { getTargetGroupCountDetail } from '@/api/targetUsers'
import CampaignManagerPhishingScenarios from '@/components/CampaignManager/PhishingScenarios/CampaignManagerPhishingScenarios'
import CustomError from '@/components/CustomError.vue'
import CampaignManagerTargetAudience from '@/components/CampaignManager/TargetAudience/CampaignManagerTargetAudience'
import CampaignManagerDeliverySettings from '@/components/CampaignManager/DeliverySettings/CampaignManagerDeliverySettings'
import { SCHEDULE_TYPES } from '@/components/CampaignManager/utils'
import { getSendCallOnDays } from '@/components/VishingCampaignManager/utils'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import { getErrorMessage } from '@/utils/functions'
import DefaultErrorDialog from '@/components/Common/Others/DefaultErrorDialog.vue'
import { SCENARIO_DISTRIBUTION } from '@/components/CampaignManager/utils'

const EMITS = {
  ON_CLOSE: 'on-close',
  ON_SUBMIT: 'on-submit'
}

export default {
  name: 'CampaignManagerAddOrEditModal',
  components: {
    CampaignManagerDeliverySettings,
    CampaignManagerTargetAudience,
    CustomError,
    CampaignManagerPhishingScenarios,
    StepperFooter,
    CampaignManagerSummary,
    CampaignManagerCampaignInfo,
    ConfigureCompanyStepHeader,
    DefaultErrorDialog,
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
    },
    categories: {
      type: Array
    }
  },
  emits: EMITS,
  data() {
    return {
      SCENARIO_DISTRIBUTION,
      createErrorMessage: '',
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
      scenarioDistribution: null,
      defaultTargetGroupResourceIds: [],
      scheduleInfoResponse: {}
    }
  },
  computed: {
    isMFAScenarioSelected() {
      return this.selectedPhishingScenarios.some((scenario) => scenario.method === 'MFA')
    },
    getTotalTargetUserCountForTargetAudience() {
      if (Object.keys(this.userCountDetailResponse)?.length) return this.totalTargetUserCount
      return this.selectedTargetGroupsMapped.reduce(
        (acc, group) => acc + group?.extraDatas?.userCount,
        0
      )
    },
    showSchedule() {
      if (this.step === 5) {
        const { refCampaignManagerDeliverySettings } = this.$refs
        return (
          refCampaignManagerDeliverySettings?.inputScheduleFormData?.scheduleTypeId !==
            SCHEDULE_TYPES.SAVE_FOR_LATER &&
          refCampaignManagerDeliverySettings?.formData?.frequency !== 0
        )
      }
      return false
    },
    getCampaignResourceId() {
      return this.selectedRow?.resourceId || ''
    },
    getTitle() {
      const text = this.isEdit ? labels.Edit : labels.New
      return `${text} Phishing Campaign`
    },
    getSaveButtonText() {
      return [1, 2, 3, 4].includes(this.step) ? labels.Next : labels.Launch
    },
    targetGroupResourceIds() {
      return this.selectedTargetGroupsMapped.map((group) => group.value)
    },
    targetGroupCompanyNames() {
      return Array.from(
        new Set(this.selectedTargetGroupsMapped.map((tg) => tg?.extraDatas?.companyName))
      )
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
      if (this.step === 5) {
        const {
          refCampaignManagerCampaignInfo,
          refCampaignManagerTargetAudience,
          refCampaignManagerDeliverySettings,
          refCampaignManagerPhishingScenarios
        } = this.$refs
        const scheduleTypeId =
          refCampaignManagerDeliverySettings.inputScheduleFormData.scheduleTypeId
        let selectedSchedule =
          refCampaignManagerDeliverySettings?.inputScheduleFormData?.scheduledDate || ''
        if (scheduleTypeId === SCHEDULE_TYPES.SAVE_FOR_LATER) selectedSchedule = labels.Later
        else {
          selectedSchedule = this?.scheduleInfoResponse?.isStarting
            ? labels.Now
            : `${selectedSchedule} ${refCampaignManagerDeliverySettings?.selectedTimeZoneText}`
        }
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
        formData.selectedEmailDelivery = refCampaignManagerDeliverySettings?.emailDelivery
        formData.sendingLimit =
          refCampaignManagerDeliverySettings?.inputDistributionFormData?.sendingLimit
        formData.selectedSchedule = selectedSchedule
        formData.useTargetUserTimeZone =
          refCampaignManagerDeliverySettings?.inputScheduleFormData?.useTargetUserTimeZone
        formData.selectedScheduleId = scheduleTypeId
        formData.targetGroupResourceIds = this.targetGroupResourceIds
        formData.selectedTargetGroups = this.selectedTargetGroups
        formData.selectedPhishingScenarios = this.selectedPhishingScenarios
        formData.scheduledDateTimeZoneId =
          refCampaignManagerDeliverySettings?.inputScheduleFormData?.scheduledDateTimeZoneId
        formData.scheduledDate =
          refCampaignManagerDeliverySettings?.inputScheduleFormData?.scheduledDate
        formData.frequency = refCampaignManagerDeliverySettings.frequencyItems.find(
          (frequency) => frequency.value === refCampaignManagerDeliverySettings.formData.frequency
        )?.text
        formData.frequencyId = refCampaignManagerDeliverySettings.formData.frequency
        formData.scheduleItems = this?.scheduleInfoResponse?.scenarioListViewModels || []
        formData.trainings = refCampaignManagerPhishingScenarios?.trainingTabModel
      }
      return formData
    },
    getDefaultValuesOfCampaignInfo() {
      const keys = Object.keys(this.selectedRowFormData)
      if (!keys.length) return {}
      const { name, duration, excludeFromReports } = this.selectedRowFormData
      return {
        name,
        duration,
        excludeFromReports
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
    },
    getDefaultValuesDeliverySettings() {
      const keys = Object.keys(this.selectedRowFormData)
      if (!keys.length) return {}
      const {
        distributionEmailOver,
        distributionEmailOverTimeTypeId,
        distributionDelayEvery,
        distributionDelayTimeTypeId,
        distributionTypeId,
        sendingLimit,
        sendOnlyActiveUsers,
        sendRandomlyUsersCount,
        sendRandomlyUsersCalculateTypeId,
        smtpSetting,
        directEmailSetting,
        emailDeliverySettingType,
        scheduleTypeId,
        scheduledDate,
        scheduledDateTimeZoneId,
        frequency,
        distributionDays,
        distributionStartTime,
        distributionEndTime,
        distributionStartTypeId
      } = this.selectedRowFormData
      return {
        smtpSetting,
        distributionEmailOver: distributionEmailOver.toString(),
        distributionEmailOverTimeTypeId: distributionEmailOverTimeTypeId.toString(),
        distributionDelayEvery: distributionDelayEvery.toString(),
        distributionDelayTimeTypeId: distributionDelayTimeTypeId.toString(),
        distributionTypeId: distributionTypeId.toString(),
        sendingLimit,
        sendOnlyActiveUsers,
        sendRandomlyUsersCount,
        emailDeliverySettingType,
        directEmailSetting,
        sendRandomlyUsersCalculateTypeId: sendRandomlyUsersCalculateTypeId.toString(),
        scheduleTypeId: scheduleTypeId.toString(),
        scheduledDate,
        scheduledDateTimeZoneId,
        frequency,
        distributionDays,
        distributionStartTime: distributionStartTime || '09:00',
        distributionEndTime: distributionEndTime || '17:00',
        distributionStartTypeId,
        sendCallsOnDays: getSendCallOnDays(distributionDays)
      }
    },
    getUserTargetAudienceData() {
      const defaultObj = {
        sendOnlyActiveUsers: false,
        sendRandomlyUsers: false,
        sendRandomlyUsersCount: 20,
        sendRandomlyUsersCalculateTypeId: '1'
      }
      if (this.step === 4) {
        const { refCampaignManagerTargetAudience } = this.$refs
        return refCampaignManagerTargetAudience?.formData || defaultObj
      }
      return defaultObj
    }
  },
  watch: {
    selectedPhishingScenarios(val) {
      this.isPhishingScenariosValid = !!val.length
    },
    step(val) {
      if (val === 4) {
        this?.$refs?.refCampaignManagerDeliverySettings?.callForEmailDeliveries()
      }
      if (
        val === 4 &&
        this?.$refs?.refCampaignManagerDeliverySettings?.inputScheduleFormData &&
        !this?.$refs?.refCampaignManagerDeliverySettings?.inputScheduleFormData?.scheduledDate
      ) {
        this.$refs.refCampaignManagerDeliverySettings.inputScheduleFormData.scheduledDate = this.$moment(
          Date.now()
        ).format(getTimeZoneForMoment())
      }
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
    handleDistributionChanged(val) {
      this.scenarioDistribution = val
    },
    callForLanguages() {
      LookupLocalStorage.getSingle(21).then((response) => {
        this.languageOptions =
          response?.map((language) => ({
            name: language.name,
            text: language.description,
            value: language.resourceId
          })) || []
      })
    },
    getInitialCampaignManagerCampaignInfo(values) {
      this.initialFormValues = { ...this.initialFormValues, ...values }
    },
    callForData() {
      getCampaignManager(this.getCampaignResourceId).then((response) => {
        const { data: { data = {} } = {} } = response
        if (this.isDuplicate) {
          data.name = `${data.name} - Copy`
        }
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
          const { refCampaignManagerPhishingScenarios } = this.$refs
          this.isPhishingScenariosValid =
            refCampaignManagerPhishingScenarios?.scenarioDistribution !==
              SCENARIO_DISTRIBUTION.MANUALLY ||
            (refCampaignManagerPhishingScenarios?.scenarioDistribution ===
              SCENARIO_DISTRIBUTION.MANUALLY &&
              !!this.selectedPhishingScenarios.length)
          if (!this.isPhishingScenariosValid) return
          //if languages empty set all languages
          refCampaignManagerPhishingScenarios?.adjustTrainingModel(
            refCampaignManagerPhishingScenarios.selectedTemplateResourceId
          )
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
          const { refCampaignManagerDeliverySettings } = this.$refs
          if (!refCampaignManagerDeliverySettings?.emailDelivery?.type) return
          if (!refCampaignManagerDeliverySettings?.validateForm()) return
          try {
            this.setActionButtonDisability(true)
            const response = await getCalculatedScheduleInfo({
              scheduleTypeId:
                refCampaignManagerDeliverySettings?.inputScheduleFormData?.scheduleTypeId,
              scheduledDate:
                refCampaignManagerDeliverySettings?.inputScheduleFormData?.scheduledDate,
              scheduledDateTimeZoneId:
                refCampaignManagerDeliverySettings?.inputScheduleFormData?.scheduledDateTimeZoneId,
              frequency: refCampaignManagerDeliverySettings?.formData?.frequency,
              phishingScenarioResourceIds: this.selectedPhishingScenarios.map(
                (pScenario) => pScenario.resourceId
              )
            })
            this.scheduleInfoResponse = response?.data?.data
          } catch (e) {
            this.setActionButtonDisability(false)
            return
          }
          if (
            refCampaignManagerDeliverySettings.emailDelivery.type ===
            EMAIL_DELIVERY_TYPES.DIRECT_EMAIL
          ) {
            this.changeStep()
            this.setActionButtonDisability(false)
            return
          }
          if (
            refCampaignManagerDeliverySettings &&
            refCampaignManagerDeliverySettings.testEmailErrorMessage &&
            !refCampaignManagerDeliverySettings.isTestMailSend
          ) {
            refCampaignManagerDeliverySettings.toggleShowSmtpErrorDialog()
          } else if (
            refCampaignManagerDeliverySettings &&
            !refCampaignManagerDeliverySettings.testEmailErrorMessage &&
            !refCampaignManagerDeliverySettings.isTestMailSend
          ) {
            try {
              const testResponse = await refCampaignManagerDeliverySettings.callForTestConnection()
              if (testResponse) {
                this.changeStep()
              } else {
                refCampaignManagerDeliverySettings.toggleShowSmtpErrorDialog()
              }
            } catch (e) {
              refCampaignManagerDeliverySettings.toggleShowSmtpErrorDialog()
            }
          } else {
            this.changeStep()
          }
          this.setActionButtonDisability(false)
          return
        case 5:
          let {
            refCampaignManagerSummary,
            refCampaignManagerCampaignInfo: { formData: campaignManagerFormData },
            refCampaignManagerTargetAudience: { formData: targetAudienceFormData },
            refCampaignManagerDeliverySettings: {
              formData: deliverySettingsFormData,
              inputScheduleFormData,
              inputDistributionFormData
            },
            refCampaignManagerPhishingScenarios: { trainingTabModel }
          } = this.$refs
          if (refCampaignManagerSummary?.canRenderNoPhoneNumberAlertBox) {
            this.$store.dispatch('common/createSnackBar', {
              message: 'There are no defined phone numbers for the selected target groups.',
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              icon: 'mdi-information'
            })
            return
          }
          if (this.selectedPhishingScenarios.length > this.totalTargetUserCount) {
            this.$store.dispatch('common/createSnackBar', {
              message:
                'The count of scenarios selected should not exceed the count of target users selected.',
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              icon: 'mdi-information'
            })
            return
          }
          deliverySettingsFormData = {
            ...deliverySettingsFormData,
            ...inputScheduleFormData,
            ...inputDistributionFormData
          }
          const phishingScenarios = []
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
            phishingScenarios.push({
              trainingId,
              trainingLanguageIds: trainingLanguageIds.filter((lang) => lang !== labels.All),
              phishingScenarioResourceId,
              enrollmentReminder: enrollmentReminderEveryValue ? enrollmentReminder : null,
              awardCertificate,
              enrollmentSendTypeId
            })
          })
          const payload = {
            phishingScenarios,
            targetGroupResourceIds: this.targetGroupResourceIds,
            name: campaignManagerFormData.name,
            excludeFromReports: campaignManagerFormData.excludeFromReports,
            duration: campaignManagerFormData.duration,
            scheduleTypeId: parseInt(deliverySettingsFormData.scheduleTypeId),
            scheduledDate:
              deliverySettingsFormData?.scheduleTypeId?.toString() !== SCHEDULE_TYPES.SCHEDULE_TO
                ? null
                : deliverySettingsFormData.scheduledDate,
            scheduledDateTimeZoneId:
              deliverySettingsFormData?.scheduleTypeId?.toString() !== SCHEDULE_TYPES.SCHEDULE_TO
                ? null
                : deliverySettingsFormData.scheduledDateTimeZoneId,
            useTargetUserTimeZone: deliverySettingsFormData.useTargetUserTimeZone,
            distributionTypeId: deliverySettingsFormData.distributionTypeId,
            distributionDelayEvery: deliverySettingsFormData.distributionDelayEvery,
            distributionDelayTimeTypeId: deliverySettingsFormData.distributionDelayTimeTypeId,
            distributionEmailOver: deliverySettingsFormData.distributionEmailOver,
            distributionEmailOverTimeTypeId:
              deliverySettingsFormData.distributionEmailOverTimeTypeId,
            sendingLimit: deliverySettingsFormData.sendingLimit,
            smtpSettingResourceId: deliverySettingsFormData.smtpSettingResourceId,
            directEmailSettingResourceId: deliverySettingsFormData.directEmailSettingResourceId,
            emailDeliverySettingType: deliverySettingsFormData.emailDeliverySettingType,
            sendOnlyActiveUsers: targetAudienceFormData.sendOnlyActiveUsers,
            sendRandomlyUsers: targetAudienceFormData.sendRandomlyUsers,
            sendRandomlyUsersCount: targetAudienceFormData.sendRandomlyUsersCount,
            frequency: deliverySettingsFormData.frequency,
            distributionStartTime: deliverySettingsFormData.distributionStartTime,
            distributionEndTime: deliverySettingsFormData.distributionEndTime,
            distributionDays: deliverySettingsFormData.distributionDays,
            distributionStartTypeId: deliverySettingsFormData.distributionStartTypeId,
            sendRandomlyUsersCalculateTypeId:
              targetAudienceFormData.sendRandomlyUsersCalculateTypeId
          }
          this.setActionButtonDisability(true)
          if (this.isEdit) {
            updateCampaignManager(this.getCampaignResourceId, payload)
              .then(() => {
                this.$emit(EMITS.ON_SUBMIT)
              })
              .catch((error) => {
                this.createErrorMessage = getErrorMessage(error)
              })
              .finally(this.setActionButtonDisability)
          } else {
            createCampaignManager(payload)
              .then(() => {
                this.$emit(EMITS.ON_SUBMIT)
              })
              .catch((error) => {
                this.createErrorMessage = getErrorMessage(error)
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
