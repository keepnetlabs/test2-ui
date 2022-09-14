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
      <v-stepper v-model="step" class="k-stepper">
        <v-stepper-header class="k-stepper__header">
          <v-stepper-step
            id="step--campaign-manager-add-or-edit-modal-campaign-info"
            class="k-stepper__step"
            :complete="step > 1"
            :step="1"
            >{{ labels.CampaignInfo }}
          </v-stepper-step>
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            id="step--campaign-manager-add-or-edit-modal-advanced-settings"
            class="k-stepper__step"
            :complete="step > 2"
            :step="2"
            >{{ labels.AdvancedSettings }}
          </v-stepper-step>
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            id="step--campaign-manager-add-or-edit-modal-campaign-summary"
            class="k-stepper__step"
            :complete="step > 3"
            :step="3"
            >{{ labels.CampaignSummary }}
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items class="k-stepper__items">
          <v-stepper-content class="k-stepper__content" :step="1">
            <ConfigureCompanyStepHeader
              class="mb-8"
              :title="labels.PhishingCampaignInfo"
              :subtitle="labels.PhishingCampaignInfoSub"
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
              :title="labels.AdvancedSettings"
              :subtitle="labels.AdvancedSettingsSub"
            />
            <CampaignManagerAdvancedSettings
              ref="refCampaignManagerAdvancedSettings"
              :form-details="getAdvancedSettingsFormDetails"
              :default-values="getDefaultValuesOfAdvancedSettings"
              :selected-phishing-scenario="getSelectedPhishingScenario"
              @on-increment-step="step++"
              @set-action-button-disability="setActionButtonDisability"
            />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="3">
            <ConfigureCompanyStepHeader
              :title="labels.CampaignSummary"
              :subtitle="labels.CampaignSummarySub"
            />
            <CampaignManagerSummary
              ref="refCampaignManagerSummary"
              :form-data="getFormDataForCampaignSummary"
            />
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </template>
    <template #overlay-footer>
      <StepperFooter
        max-step="3"
        :ids="{
          cancelButton: 'btn-cancel--add-or-edit-company-manager-modal',
          backButton: 'btn-back--add-or-edit-company-manager-modal',
          saveButton: 'btn-next--add-or-edit-company-manager-modal'
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
import { scrollToComponent, isDifferent } from '@/utils/functions'
import CampaignManagerAdvancedSettings from '@/components/CampaignManager/AdvancedSettings/CampaignManagerAdvancedSettings'
import CampaignManagerSummary from '@/components/CampaignManager/Summary/CampaignManagerSummary'
import {
  createCampaignManager,
  getCampaignManager,
  updateCampaignManager
} from '@/api/phishingsimulator'
import { getPhishingReportSummary } from '@/api/phishingReporter'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import StepperFooter from '@/components/Stepper/StepperFooter'

const EMITS = {
  ON_CLOSE: 'on-close',
  ON_SUBMIT: 'on-submit'
}

export default {
  name: 'CampaignManagerAddOrEditModal',
  components: {
    StepperFooter,
    CampaignManagerSummary,
    CampaignManagerAdvancedSettings,
    CampaignManagerCampaignInfo,
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
      isActionButtonDisabled: false,
      labels,
      step: 1,
      selectedRowFormData: {},
      initialFormValues: {},
      languageOptions: []
    }
  },
  computed: {
    getTitle() {
      const text = this.isEdit ? labels.Edit : labels.New
      return `${text} Phishing Campaign`
    },
    getLastStepText() {
      return this.$refs.refCampaignManagerCampaignInfo.formData.scheduleTypeId === '1'
        ? labels.Start
        : labels.Save
    },
    getSaveButtonText() {
      return [1, 2].includes(this.step) ? labels.Next : this.getLastStepText
    },
    getSelectedPhishingScenario() {
      let selectedScenario = {}
      if (this.step === 2) {
        const { refCampaignManagerCampaignInfo } = this.$refs
        const { refCampaignManagerPhishingScenarios } = refCampaignManagerCampaignInfo.$refs
        selectedScenario = refCampaignManagerPhishingScenarios?.emailTemplateParams || {}
        selectedScenario.template = refCampaignManagerPhishingScenarios?.emailTemplate || ''
      }
      return selectedScenario
    },
    getFormDataForCampaignSummary() {
      let formData = {}
      if (this.step === 3) {
        const { refCampaignManagerCampaignInfo, refCampaignManagerAdvancedSettings } = this.$refs
        const emailTemplateParams =
          refCampaignManagerCampaignInfo.$refs.refCampaignManagerPhishingScenarios
            .emailTemplateParams
        emailTemplateParams.languageShortCode = this.languageOptions.find(
          (language) => language.value === emailTemplateParams.languageTypeResourceId
        )?.text

        const landingPageParams =
          refCampaignManagerCampaignInfo.$refs.refCampaignManagerPhishingScenarios.landingPageParams
        landingPageParams.languageShortCode = this.languageOptions.find(
          (language) => language.value === landingPageParams.languageTypeResourceId
        )?.text

        formData = {
          ...formData,
          ...refCampaignManagerCampaignInfo.formData,
          ...refCampaignManagerAdvancedSettings.formData,
          emailTemplate:
            refCampaignManagerCampaignInfo?.$refs.refCampaignManagerPhishingScenarios
              ?.emailTemplate || '',
          emailTemplateParams,
          landingPageTemplates:
            refCampaignManagerCampaignInfo.$refs.refCampaignManagerPhishingScenarios
              .landingPageTemplates,
          landingPageParams
        }

        formData.selectedPhishingScenario =
          refCampaignManagerCampaignInfo.phishingScenarioItems.find(
            (item) => item.resourceId === formData.phishingScenarioResourceId
          ) || refCampaignManagerCampaignInfo.formData.phishingScenario

        formData.selectedSchedule =
          refCampaignManagerCampaignInfo.formData.scheduleTypeId === '1' ? 'Now' : 'Later'
        formData.selectedSmtpSetting = refCampaignManagerAdvancedSettings.responseOfSmtpItems.find(
          (item) => item.resourceId === formData.smtpSettingResourceId
        )
      }
      return formData
    },
    getAdvancedSettingsFormDetails() {
      if (!this.formDetails) return {}
      const {
        distributionEmailOverTimeTypes,
        distributionSmtpDelayTimeTypes,
        sendRandomlyUsersCalculateTypes
      } = this.formDetails
      return {
        distributionEmailOverTimeTypes,
        distributionSmtpDelayTimeTypes,
        sendRandomlyUsersCalculateTypes
      }
    },
    getDefaultValuesOfCampaignInfo() {
      const keys = Object.keys(this.selectedRowFormData)
      if (!keys.length) return {}
      const {
        name,
        targetGroups,
        phishingScenario,
        scheduleTypeId,
        duration,
        scheduledDate,
        scheduledDateTimeZoneId
      } = this.selectedRowFormData
      return {
        name,
        targetGroups,
        phishingScenario,
        scheduleTypeId: scheduleTypeId.toString(),
        duration,
        scheduledDate,
        scheduledDateTimeZoneId
      }
    },
    getDefaultValuesOfAdvancedSettings() {
      const keys = Object.keys(this.selectedRowFormData)
      if (!keys.length) return {}
      const {
        distributionEmailOver,
        distributionEmailOverTimeTypeId,
        distributionSmtpDelayEvery,
        distributionSmtpDelayTimeTypeId,
        distributionTypeId,
        sendingLimit,
        excludeFromReports,
        sendOnlyActiveUsers,
        sendRandomlyUsersCount,
        sendRandomlyUsersCalculateTypeId,
        smtpSetting
      } = this.selectedRowFormData
      return {
        smtpSetting,
        distributionEmailOver: distributionEmailOver.toString(),
        distributionEmailOverTimeTypeId: distributionEmailOverTimeTypeId.toString(),
        distributionSmtpDelayEvery: distributionSmtpDelayEvery.toString(),
        distributionSmtpDelayTimeTypeId: distributionSmtpDelayTimeTypeId.toString(),
        distributionTypeId: distributionTypeId.toString(),
        sendingLimit,
        excludeFromReports,
        sendOnlyActiveUsers,
        sendRandomlyUsersCount,
        sendRandomlyUsersCalculateTypeId: sendRandomlyUsersCalculateTypeId.toString()
      }
    }
  },
  created() {
    LookupLocalStorage.getSingle(21).then((response) => {
      this.languageOptions =
        response?.map((language) => ({ text: language.description, value: language.resourceId })) ||
        []
    })
    if (this.selectedRow) {
      this.callForData()
    }
  },
  methods: {
    getInitialCampaignManagerCampaignInfo(values) {
      this.initialFormValues = { ...this.initialFormValues, ...values }
    },
    callForData() {
      getCampaignManager(this.selectedRow.resourceId).then((response) => {
        const { data: { data = {} } = {} } = response
        if (this.isDuplicate) {
          data.name = `${data.name} - Copy`
        }
        this.selectedRowFormData = data
      })
    },
    callForActiveOutlookUsers() {
      const today = new Date()
      const day = today.getUTCDate()
      const month = today.getUTCMonth() + 1
      const year = today.getUTCFullYear()
      const hours = today.getUTCHours()
      const minutes = today.getUTCMinutes()
      const seconds = today.getUTCSeconds()
      const fourMinutesBefore = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        today.getHours(),
        today.getMinutes() - 4,
        today.getSeconds()
      )
      const fourMinutesBeforeMonth = fourMinutesBefore.getUTCMonth() + 1
      const fourMinutesBeforeDay = fourMinutesBefore.getUTCDate()
      const fourMinutesBeforeHours = fourMinutesBefore.getUTCHours()
      const fourMinutesBeforeMinutes = fourMinutesBefore.getUTCMinutes()
      const fourMinutesBeforeSeconds = fourMinutesBefore.getUTCSeconds()
      const dateObj = {
        endDate: `${year}-${this.getDateValue(month)}-${this.getDateValue(day)}-${this.getDateValue(
          hours
        )}-${this.getDateValue(minutes)}-${this.getDateValue(seconds)}`,
        startDate: `${fourMinutesBefore.getUTCFullYear()}-${this.getDateValue(
          fourMinutesBeforeMonth
        )}-${this.getDateValue(fourMinutesBeforeDay)}-${this.getDateValue(
          fourMinutesBeforeHours
        )}-${this.getDateValue(fourMinutesBeforeMinutes)}-${this.getDateValue(
          fourMinutesBeforeSeconds
        )}`
      }
      return getPhishingReportSummary({
        startDate: dateObj.startDate,
        endDate: dateObj.endDate
      })
    },
    getDateValue(value) {
      value = typeof value == 'string' ? value : value.toString()
      return value.length === 1 ? `0${value}` : `${value}`
    },
    getFormValues() {
      const {
        refCampaignManagerCampaignInfo: { formData: campaignManagerFormData },
        refCampaignManagerAdvancedSettings: { formData: advancedSettingsFormData }
      } = this.$refs
      return { ...campaignManagerFormData, ...advancedSettingsFormData }
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
    showErrorMessage(ref) {
      this.$nextTick(() => {
        const el = ref.$el.querySelector('.error--text')
        scrollToComponent(el)
      })
    },
    changeStep(flag = 1) {
      const { refCampaignManagerAdvancedSettings, refCampaignManagerCampaignInfo } = this.$refs
      if (this.step === 2 && flag === 1) {
        if (
          refCampaignManagerAdvancedSettings &&
          refCampaignManagerAdvancedSettings.testEmailErrorMessage &&
          !refCampaignManagerAdvancedSettings.isTestMailSend
        ) {
          refCampaignManagerAdvancedSettings.toggleShowSmtpErrorDialog()
        } else if (
          refCampaignManagerAdvancedSettings &&
          !refCampaignManagerAdvancedSettings.testEmailErrorMessage &&
          !refCampaignManagerAdvancedSettings.isTestMailSend
        ) {
          refCampaignManagerAdvancedSettings
            .callForTestConnection()
            .then((response) => {
              if (response) {
                this.step++
              } else {
                refCampaignManagerAdvancedSettings.toggleShowSmtpErrorDialog()
              }
            })
            .catch(() => {
              refCampaignManagerAdvancedSettings.toggleShowSmtpErrorDialog()
            })
        } else {
          this.step++
        }
      } else if (this.step === 1 && flag === 1) {
        this.setActionButtonDisability(true)
        this.callForActiveOutlookUsers().then((response) => {
          const { data } = response.data
          refCampaignManagerAdvancedSettings.isUsersOnline = !!data['onlineUsersCount']
        })
        const targetGroups = refCampaignManagerCampaignInfo.selectedTargetGroups
        const ids = refCampaignManagerCampaignInfo.formData.targetGroupResourceIds.map(
          (item) => item.value
        )
        const totalUserCount = targetGroups.reduce((acc, item) => {
          acc += item?.userCount || 0
          return acc
        }, 0)

        refCampaignManagerAdvancedSettings.totalTargetUserCount = totalUserCount
        refCampaignManagerAdvancedSettings.targetGroupResourceIds = ids
        if (totalUserCount) {
          refCampaignManagerCampaignInfo.isShowTargetGroupUsersError = false
          refCampaignManagerCampaignInfo.isTargetGroupsValid = true
          this.step += flag
          refCampaignManagerAdvancedSettings.callForCalculateSendingInfo()
        } else {
          refCampaignManagerCampaignInfo.isShowTargetGroupUsersError = true
          refCampaignManagerCampaignInfo.isTargetGroupsValid = false
          this.showErrorMessage(refCampaignManagerCampaignInfo.$refs.refForm)
        }
        refCampaignManagerCampaignInfo.formData.selectedTargetGroups = targetGroups
        this.setActionButtonDisability(false)
      } else {
        this.step += flag
      }
    },
    setActionButtonDisability(flag = false) {
      this.isActionButtonDisabled = flag
    },
    handleSubmit() {
      switch (this.step) {
        case 1:
          const { refCampaignManagerCampaignInfo } = this.$refs
          const { refForm } = refCampaignManagerCampaignInfo.$refs
          if (
            refCampaignManagerCampaignInfo.formData.scheduleTypeId === '3' &&
            !refCampaignManagerCampaignInfo.formData.scheduledDate
          ) {
            refCampaignManagerCampaignInfo.isDateValid = false
          }
          if (!refCampaignManagerCampaignInfo.formData.targetGroupResourceIds.length) {
            refCampaignManagerCampaignInfo.isTargetGroupsValid = false
          }
          if (
            refForm.validate() &&
            refCampaignManagerCampaignInfo.isDateValid &&
            refCampaignManagerCampaignInfo.isTargetGroupsValid
          )
            this.changeStep()
          else this.showErrorMessage(refForm)
          break
        case 2:
          const { refCampaignManagerAdvancedSettings } = this.$refs
          const { refForm: refFormAdvanced } = refCampaignManagerAdvancedSettings.$refs
          if (refFormAdvanced && refFormAdvanced.validate()) this.changeStep()
          else this.showErrorMessage(refFormAdvanced)
          break
        case 3:
          const {
            refCampaignManagerCampaignInfo: { formData: campaignManagerFormData },
            refCampaignManagerAdvancedSettings: { formData: advancedSettingsFormData }
          } = this.$refs

          const payload = {
            name: campaignManagerFormData.name,
            phishingScenarioResourceId: campaignManagerFormData.phishingScenarioResourceId,
            duration: campaignManagerFormData.duration,
            targetGroupResourceIds: campaignManagerFormData.targetGroupResourceIds.map(
              (item) => item.value
            ),
            scheduledDateTimeZoneId: campaignManagerFormData.scheduledDateTimeZoneId,
            scheduledDate: campaignManagerFormData.scheduledDate,
            scheduleTypeId: parseInt(campaignManagerFormData.scheduleTypeId),
            scheduledDate:
              parseInt(campaignManagerFormData.scheduleTypeId) !== 3
                ? null
                : campaignManagerFormData.scheduledDate,
            distributionTypeId: advancedSettingsFormData.distributionTypeId,
            distributionSmtpDelayEvery: advancedSettingsFormData.distributionSmtpDelayEvery,
            distributionSmtpDelayTimeTypeId:
              advancedSettingsFormData.distributionSmtpDelayTimeTypeId,
            distributionEmailOver: advancedSettingsFormData.distributionEmailOver,
            distributionEmailOverTimeTypeId:
              advancedSettingsFormData.distributionEmailOverTimeTypeId,
            sendingLimit: advancedSettingsFormData.sendingLimit,
            excludeFromReports: advancedSettingsFormData.excludeFromReports,
            sendOnlyActiveUsers: advancedSettingsFormData.sendOnlyActiveUsers,
            sendRandomlyUsers: advancedSettingsFormData.sendRandomlyUsers,
            sendRandomlyUsersCount: advancedSettingsFormData.sendRandomlyUsersCount,
            sendRandomlyUsersCalculateTypeId:
              advancedSettingsFormData.sendRandomlyUsersCalculateTypeId,
            smtpSettingResourceId: advancedSettingsFormData.smtpSettingResourceId
          }
          this.setActionButtonDisability(true)
          if (this.isEdit) {
            updateCampaignManager(this.selectedRow.resourceId, payload)
              .then(() => {
                this.$emit(EMITS.ON_SUBMIT)
              })
              .finally(this.setActionButtonDisability)
          } else {
            createCampaignManager(payload)
              .then(() => {
                this.$emit(EMITS.ON_SUBMIT)
              })
              .finally(this.setActionButtonDisability)
          }
      }
    }
  },
  mounted() {
    this.initialFormValues = this.getFormValues()
  }
}
</script>
