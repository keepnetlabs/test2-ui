<template>
  <AppModal
    :status="status"
    icon-name="$callback"
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
            >Callback Scenarios
          </v-stepper-step>
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            id="step--campaign-manager-add-or-edit-modal-target-audience"
            class="k-stepper__step"
            :complete="step > 3"
            :step="3"
            >Target Audience
          </v-stepper-step>
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            id="step--campaign-manager-add-or-edit-modal-campaign-summary"
            class="k-stepper__step"
            :complete="step > 4"
            :step="4"
            >Delivery Settings
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
              title="Callback Campaign Settings"
              subtitle="Enter basic information about this campaign"
            />
            <CampaignManagerCampaignInfo
              ref="refCampaignManagerCampaignInfo"
              :default-values="getDefaultValuesOfCampaignInfo"
              :is-edit="isEdit"
              :is-action-button-disabled.sync="isActionButtonDisabled"
              isCallback
              @initialFormValues="getInitialCampaignManagerCampaignInfo"
            />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="2">
            <ConfigureCompanyStepHeader
              class="mb-8"
              title="Callback Scenarios"
              subtitle="Select a callback scenario for your campaign."
            />
            <AlertBox
              class="bg-aqua-light mb-4"
              style="margin-right: 120px;"
              icon-color="#2196F3"
              icon-name="mdi-information"
              :slots="{ primaryAction: false, secondaryAction: false }"
            >
              <template #text>
                <p class="mb-0 mb-n1">
                  You have <strong>{{ getAvailableNumberCount }}</strong> available phone numbers
                  for Callback Simulator. Therefore you can select up to
                  <strong>{{ getAvailableNumberCount }}</strong> Callback Scenarios.
                </p>
              </template>
            </AlertBox>
            <CampaignManagerCallbackScenarios
              v-model="selectedPhishingScenarios"
              ref="refCampaignManagerPhishingScenarios"
              :campaign-manager-resource-id="getCampaignResourceId"
              :is-edit="isEdit || isDuplicate"
              :languages="languageOptions"
              :languageItems="languages"
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
              :is-multiple-phishing-scenarios="selectedPhishingScenarios.length > 1"
              :is-all-groups="!isEdit"
              :default-values="getDefaultTargetAudienceSettings"
              :selected-target-groups.sync="selectedTargetGroups"
              :selected-target-groups-mapped.sync="selectedTargetGroupsMapped"
              :total-target-user-count="getTotalTargetUserCountForTargetAudience"
              :default-selected-target-group-resource-ids="defaultTargetGroupResourceIds"
              :form-details="formDetails"
              :is-call-api-when-created="!isEdit"
              isCallback
            />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="4">
            <ConfigureCompanyStepHeader
              title="Delivery Settings"
              subtitle="Set email delivery and call phone number region options"
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
              :type="SCENARIO_TYPES.CALLBACK"
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
              :form-data="getFormDataForCampaignSummary"
              :language-options="languageOptions"
              :languages="languages"
              :show-schedule="showSchedule"
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
import CampaignManagerSummary from '@/components/CallbackCampaignManager/CampaignManagerSummary'
import CallbackService from '@/api/callback'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import StepperFooter from '@/components/Stepper/StepperFooter'
import { getTargetGroupCountDetail } from '@/api/targetUsers'
import CampaignManagerCallbackScenarios from '@/components/CallbackCampaignManager/CampaignManagerCallbackScenarios'
import CustomError from '@/components/CustomError.vue'
import CampaignManagerTargetAudience from '@/components/CampaignManager/TargetAudience/CampaignManagerTargetAudience'
import { SCHEDULE_TYPES } from '@/components/CampaignManager/utils'
import { getSendCallOnDays } from '@/components/VishingCampaignManager/utils'
import AlertBox from '@/components/AlertBox'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import CampaignManagerDeliverySettings from '@/components/CampaignManager/DeliverySettings/CampaignManagerDeliverySettings'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
const EMITS = {
  ON_CLOSE: 'on-close',
  ON_SUBMIT: 'on-submit'
}

export default {
  name: 'CampaignManagerAddOrEditModal',
  components: {
    CampaignManagerTargetAudience,
    CustomError,
    CampaignManagerCallbackScenarios,
    StepperFooter,
    CampaignManagerSummary,
    CampaignManagerCampaignInfo,
    ConfigureCompanyStepHeader,
    AppModal,
    AlertBox,
    CampaignManagerDeliverySettings
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
    availableNumbers: {
      type: Number
    },
    languages: {
      type: Array
    }
  },
  emits: EMITS,
  data() {
    return {
      SCENARIO_TYPES,
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
      scheduleInfoResponse: {}
    }
  },
  computed: {
    getAvailableNumberCount() {
      return this.availableNumbers || 0
    },
    isMFAScenarioSelected() {
      return this.selectedPhishingScenarios.some((scenario) => scenario.method === 'MFA')
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
      return `${text} Callback Campaign`
    },
    getSaveButtonText() {
      return [1, 2, 3, 4].includes(this.step) ? labels.Next : labels.Launch
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
      if (this.step === 5) {
        const {
          refCampaignManagerCampaignInfo,
          refCampaignManagerTargetAudience,
          refCampaignManagerDeliverySettings,
          refCampaignManagerPhishingScenarios
        } = this.$refs
        const scheduleTypeId =
          refCampaignManagerDeliverySettings?.inputScheduleFormData?.scheduleTypeId
        let selectedSchedule =
          refCampaignManagerDeliverySettings?.inputScheduleFormData?.scheduledDate || ''
        if (scheduleTypeId === SCHEDULE_TYPES.SAVE_FOR_LATER) selectedSchedule = labels.Later
        else {
          selectedSchedule = this?.scheduleInfoResponse?.isStarting
            ? labels.Now
            : `${selectedSchedule} ${refCampaignManagerDeliverySettings?.selectedTimeZoneText}`
        }
        formData.userCountDetailResponse = this.userCountDetailResponse
        formData.excludeFromReports = refCampaignManagerCampaignInfo.formData.excludeFromReports
        formData.sendOnlyActiveUsers = refCampaignManagerTargetAudience.formData.sendOnlyActiveUsers
        formData.sendRandomlyUsers = refCampaignManagerTargetAudience.formData.sendRandomlyUsers
        formData.name = refCampaignManagerCampaignInfo.formData.name
        formData.duration = refCampaignManagerCampaignInfo.formData.duration
        formData.senderPhoneNumber = refCampaignManagerDeliverySettings.formData.phoneNumber
        formData.sendRandomlyUsersCount =
          refCampaignManagerTargetAudience.formData.sendRandomlyUsersCount
        formData.sendRandomlyUsersCalculateTypeId =
          refCampaignManagerTargetAudience.formData.sendRandomlyUsersCalculateTypeId
        formData.selectedEmailDelivery = refCampaignManagerDeliverySettings?.emailDelivery
        formData.sendingLimit =
          refCampaignManagerDeliverySettings?.inputDistributionFormData?.sendingLimit
        formData.selectedSchedule = selectedSchedule
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
        formData.scheduleItems = this?.scheduleInfoResponse?.scenarioList || []
        formData.trainings = refCampaignManagerPhishingScenarios?.trainingTabModel
      }
      return formData
    },
    getDefaultValuesOfCampaignInfo() {
      const keys = Object.keys(this.selectedRowFormData)
      if (!keys.length)
        return {
          duration: 30
        }
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
      if (
        val === 4 &&
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
      CallbackService.getCallbackCampaign(this.getCampaignResourceId).then((response) => {
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
          this.isPhishingScenariosValid = !!this.selectedPhishingScenarios.length
          if (!this.isPhishingScenariosValid) return
          if (this.selectedPhishingScenarios.length > this.availableNumbers) {
            this.$store.dispatch('common/createSnackBar', {
              message: `You can select up to ${this.availableNumbers} callback scenarios.`,
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              icon: 'mdi-alert'
            })
            return
          }
          this.changeStep()
          return
        case 3:
          this.setActionButtonDisability(true)
          const { refCampaignManagerTargetAudience } = this.$refs
          if (!this.targetGroupResourceIds.length) {
            refCampaignManagerTargetAudience.isShowTargetGroupUsersError = true
            refCampaignManagerTargetAudience.isTargetGroupsValid = false
            this.setActionButtonDisability(false)
            return
          }
          this.userCountDetailResponse = await getTargetGroupCountDetail(
            this.targetGroupResourceIds
          )
          if (
            this.userCountDetailResponse?.data?.data &&
            this.userCountDetailResponse?.data?.data?.length
          ) {
            this.totalTargetUserCount =
              this.userCountDetailResponse?.data?.data
                ?.find((detail) => detail.status === 'Active')
                ?.hasPhoneNumber.find((dList) => dList.status === 'Yes')?.count || 0
            if (!this.totalTargetUserCount) {
              refCampaignManagerTargetAudience.isShowActiveAndPhoneNumberError = true
              refCampaignManagerTargetAudience.isTargetGroupsValid = false
              this.setActionButtonDisability(false)
              return
            }
            if (this.selectedPhishingScenarios.length > this.totalTargetUserCount) {
              this.$store.dispatch('common/createSnackBar', {
                message: `The target user count should not be less than the scenario count`,
                color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
                icon: 'mdi-alert'
              })
              this.setActionButtonDisability(false)
              return
            }
          } else {
            refCampaignManagerTargetAudience.isShowActiveAndPhoneNumberError = true
            refCampaignManagerTargetAudience.isTargetGroupsValid = false
            this.setActionButtonDisability(false)
            return
          }
          if (refCampaignManagerTargetAudience?.$refs?.refForm?.validate()) this.changeStep()
          this.setActionButtonDisability(false)
          return
        case 4:
          const { refCampaignManagerDeliverySettings } = this.$refs
          if (!refCampaignManagerDeliverySettings?.validateForm()) return
          try {
            this.setActionButtonDisability(true)
            const response = await CallbackService.calculateScheduleInfo({
              scheduleTypeId:
                refCampaignManagerDeliverySettings?.inputScheduleFormData?.scheduleTypeId,
              scheduledDate:
                refCampaignManagerDeliverySettings?.inputScheduleFormData?.scheduledDate,
              scheduledDateTimeZoneId:
                refCampaignManagerDeliverySettings?.inputScheduleFormData?.scheduledDateTimeZoneId,
              frequency: refCampaignManagerDeliverySettings?.formData?.frequency,
              callbackScenarioResourceIds: this.selectedPhishingScenarios.map(
                (pScenario) => pScenario.resourceId
              )
            })
            this.setActionButtonDisability(false)
            this.scheduleInfoResponse = response?.data?.data
            this.changeStep()
          } catch (e) {
            this.setActionButtonDisability(false)
          }
          return
        case 5:
          let {
            refCampaignManagerCampaignInfo: { formData: campaignManagerFormData },
            refCampaignManagerTargetAudience: { formData: targetAudienceFormData },
            refCampaignManagerDeliverySettings: {
              formData: deliverySettingsFormData,
              inputScheduleFormData,
              inputDistributionFormData
            },
            refCampaignManagerPhishingScenarios: { trainingTabModel }
          } = this.$refs
          deliverySettingsFormData = {
            ...deliverySettingsFormData,
            ...inputScheduleFormData,
            ...inputDistributionFormData
          }
          const phishingScenarios = []
          Object.keys(trainingTabModel).forEach((phishingScenarioResourceId) => {
            const { trainingId, trainingLanguageIds, isCheckboxSelected } = trainingTabModel[
              phishingScenarioResourceId
            ]
            if (!isCheckboxSelected) return
            phishingScenarios.push({
              trainingId,
              trainingLanguageIds: trainingLanguageIds.filter((lang) => lang !== labels.All),
              phishingScenarioResourceId
            })
          })
          const payload = {
            name: campaignManagerFormData.name,
            scheduleTypeId: parseInt(deliverySettingsFormData.scheduleTypeId),
            scheduledDate:
              deliverySettingsFormData?.scheduleTypeId?.toString() !== SCHEDULE_TYPES.SCHEDULE_TO
                ? null
                : deliverySettingsFormData.scheduledDate,
            scheduledDateTimeZoneId: deliverySettingsFormData.scheduledDateTimeZoneId,
            duration: parseInt(campaignManagerFormData.duration),
            distributionStartTypeId: deliverySettingsFormData.distributionStartTypeId,
            distributionTypeId: parseInt(deliverySettingsFormData.distributionTypeId),
            distributionDelayEvery: deliverySettingsFormData.distributionDelayEvery,
            distributionDelayTimeTypeId: parseInt(
              deliverySettingsFormData.distributionDelayTimeTypeId
            ),
            distributionStartTime: deliverySettingsFormData.distributionStartTime,
            distributionEndTime: deliverySettingsFormData.distributionEndTime,
            distributionDays: deliverySettingsFormData.distributionDays,
            sendingLimit: parseInt(deliverySettingsFormData.sendingLimit),
            excludeFromReports: campaignManagerFormData.excludeFromReports,
            sendOnlyActiveUsers: targetAudienceFormData.sendOnlyActiveUsers,
            sendRandomlyUsers: targetAudienceFormData.sendRandomlyUsers,
            sendRandomlyUsersCount: parseInt(targetAudienceFormData.sendRandomlyUsersCount),
            sendRandomlyUsersCalculateTypeId: parseInt(
              targetAudienceFormData.sendRandomlyUsersCalculateTypeId
            ),
            targetGroupResourceIds: this.targetGroupResourceIds,
            frequency: deliverySettingsFormData.frequency,
            phishingScenarios,
            smtpSettingResourceId: deliverySettingsFormData.smtpSettingResourceId,
            distributionEmailOver: deliverySettingsFormData.distributionEmailOver,
            distributionEmailOverTimeTypeId:
              deliverySettingsFormData.distributionEmailOverTimeTypeId,
            emailDeliverySettingType: deliverySettingsFormData.emailDeliverySettingType,
            directEmailSettingResourceId: deliverySettingsFormData.directEmailSettingResourceId
          }
          this.setActionButtonDisability(true)
          CallbackService.createCallbackCampaign(payload)
            .then(() => {
              this.$emit(EMITS.ON_SUBMIT)
            })
            .finally(this.setActionButtonDisability)
          return
        default:
          break
      }
    }
  }
}
</script>
