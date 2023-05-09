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
              :campaign-manager-resource-id="getCampaignResourceId"
              :is-edit="isEdit"
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
              :selected-target-groups.sync="selectedTargetGroups"
              :selected-target-groups-mapped.sync="selectedTargetGroupsMapped"
              :form-details="formDetails"
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
import { isDifferent } from '@/utils/functions'
import CampaignManagerSummary from '@/components/CampaignManager/Summary/CampaignManagerSummary'
import {
  createCampaignManager,
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
      selectedPhishingScenarios: []
    }
  },
  computed: {
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
          refCampaignManagerDeliverySettings
        } = this.$refs
        const scheduleTypeId = refCampaignManagerCampaignInfo.formData.scheduleTypeId
        let selectedSchedule = refCampaignManagerCampaignInfo?.formData?.scheduledDate || ''
        if (scheduleTypeId === '1') selectedSchedule = 'Now'
        else if (scheduleTypeId === '2') selectedSchedule = 'Later'
        formData.userCountDetailResponse = this.userCountDetailResponse
        formData.excludeFromReports = refCampaignManagerCampaignInfo.formData.excludeFromReports
        formData.sendOnlyActiveUsers = refCampaignManagerTargetAudience.formData.sendOnlyActiveUsers
        formData.sendRandomlyUsers = refCampaignManagerTargetAudience.formData.sendRandomlyUsers
        formData.sendRandomlyUsersCount =
          refCampaignManagerTargetAudience.formData.sendRandomlyUsersCount
        formData.sendRandomlyUsersCalculateTypeId =
          refCampaignManagerTargetAudience.formData.sendRandomlyUsersCalculateTypeId
        formData.selectedEmailDelivery = refCampaignManagerDeliverySettings?.emailDelivery
        formData.sendingLimit = refCampaignManagerDeliverySettings?.formData?.sendingLimit
        formData.selectedSchedule = selectedSchedule
        formData.targetGroupResourceIds = this.targetGroupResourceIds
        formData.selectedTargetGroups = this.selectedTargetGroups
        formData.selectedPhishingScenarios = this.selectedPhishingScenarios
      }
      return formData
    },
    getDefaultValuesOfCampaignInfo() {
      const keys = Object.keys(this.selectedRowFormData)
      if (!keys.length) return {}
      const {
        name,
        scheduleTypeId,
        duration,
        scheduledDate,
        scheduledDateTimeZoneId,
        excludeFromReports
      } = this.selectedRowFormData
      return {
        name,
        scheduleTypeId: scheduleTypeId.toString(),
        duration,
        scheduledDate,
        scheduledDateTimeZoneId,
        excludeFromReports
      }
    },
    getDefaultValuesOfPhishingScenarios() {
      return this?.selectedRowFormData?.phishingScenarios || []
    },
    getDefaultValuesDeliverySettings() {
      const keys = Object.keys(this.selectedRowFormData)
      if (!keys.length) return {}
      const {
        distributionEmailOver,
        distributionEmailOverTimeTypeId,
        distributionSmtpDelayEvery,
        distributionSmtpDelayTimeTypeId,
        distributionTypeId,
        sendingLimit,
        sendOnlyActiveUsers,
        sendRandomlyUsersCount,
        sendRandomlyUsersCalculateTypeId,
        smtpSetting,
        directEmailSetting,
        emailDeliverySettingType
      } = this.selectedRowFormData
      return {
        smtpSetting,
        distributionEmailOver: distributionEmailOver.toString(),
        distributionEmailOverTimeTypeId: distributionEmailOverTimeTypeId.toString(),
        distributionSmtpDelayEvery: distributionSmtpDelayEvery.toString(),
        distributionSmtpDelayTimeTypeId: distributionSmtpDelayTimeTypeId.toString(),
        distributionTypeId: distributionTypeId.toString(),
        sendingLimit,
        sendOnlyActiveUsers,
        sendRandomlyUsersCount,
        emailDeliverySettingType,
        directEmailSetting,
        sendRandomlyUsersCalculateTypeId: sendRandomlyUsersCalculateTypeId.toString()
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
        this.selectedTargetGroupsMapped = this.selectedTargetGroups
        this.$refs.refCampaignManagerTargetAudience.$refs.refCampaignManagerTargetGroup.$refs.refGroupTable.$refs.refTable.getSelectedObjectAndSelectRowsByRowKey(
          this.selectedTargetGroups
        )
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
          this.changeStep()
          return
        case 3:
          const { refCampaignManagerTargetAudience } = this.$refs
          this.setActionButtonDisability(true)
          this.totalTargetUserCount = this.selectedTargetGroupsMapped.reduce((acc, item) => {
            acc += item?.extraDatas.userCount || 0
            return acc
          }, 0)
          if (this.totalTargetUserCount) {
            refCampaignManagerTargetAudience.isShowTargetGroupUsersError = false
            refCampaignManagerTargetAudience.isTargetGroupsValid = true
            this.userCountDetailResponse = await getTargetGroupCountDetail(
              this.targetGroupResourceIds
            )
            this.changeStep()
          } else {
            refCampaignManagerTargetAudience.isShowTargetGroupUsersError = true
            refCampaignManagerTargetAudience.isTargetGroupsValid = false
          }
          this.setActionButtonDisability(false)
          return
        case 4:
          const { refCampaignManagerDeliverySettings } = this.$refs
          if (!refCampaignManagerDeliverySettings?.emailDelivery?.type) return
          if (
            refCampaignManagerDeliverySettings.emailDelivery.type ===
            EMAIL_DELIVERY_TYPES.DIRECT_EMAIL
          )
            return this.changeStep()
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
            refCampaignManagerDeliverySettings
              .callForTestConnection()
              .then((response) => {
                if (response) {
                  this.step++
                } else {
                  refCampaignManagerDeliverySettings.toggleShowSmtpErrorDialog()
                }
              })
              .catch(() => {
                refCampaignManagerDeliverySettings.toggleShowSmtpErrorDialog()
              })
          } else {
            this.changeStep()
          }
          return
        case 5:
          const {
            refCampaignManagerCampaignInfo: { formData: campaignManagerFormData },
            refCampaignManagerTargetAudience: { formData: targetAudienceFormData },
            refCampaignManagerDeliverySettings: { formData: deliverySettingsFormData }
          } = this.$refs
          const payload = {
            phishingScenarioResourceIds: this.selectedPhishingScenarios.map(
              (pScenario) => pScenario.resourceId
            ),
            targetGroupResourceIds: this.targetGroupResourceIds,
            name: campaignManagerFormData.name,
            excludeFromReports: campaignManagerFormData.excludeFromReports,
            duration: campaignManagerFormData.duration,
            scheduleTypeId: parseInt(campaignManagerFormData.scheduleTypeId),
            scheduledDate:
              campaignManagerFormData?.scheduleTypeId?.toString() !== SCHEDULE_TYPES.SCHEDULE_TO
                ? null
                : campaignManagerFormData.scheduledDate,
            distributionTypeId: deliverySettingsFormData.distributionTypeId,
            distributionSmtpDelayEvery: deliverySettingsFormData.distributionSmtpDelayEvery,
            distributionSmtpDelayTimeTypeId:
              deliverySettingsFormData.distributionSmtpDelayTimeTypeId,
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
            sendRandomlyUsersCalculateTypeId:
              targetAudienceFormData.sendRandomlyUsersCalculateTypeId
          }
          this.setActionButtonDisability(true)
          if (this.isEdit) {
            updateCampaignManager(this.getCampaignResourceId, payload)
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
          return
        default:
          break
      }
    }
  }
}
</script>
