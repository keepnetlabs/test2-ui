<template>
  <AppModal
    :status="status"
    icon-name="mdi-hook"
    :title="getTitle"
    class-name="add-in-configuration"
    title-id="text--phishing-scenarios-fast-launch-modal-title"
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
            >{{ labels.CampaignSettings }}
          </v-stepper-step>
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            id="step--common-simulator-fast-launch-campaign-summary"
            class="k-stepper__step"
            :complete="step > 2"
            :step="2"
            >{{ labels.CampaignSummary }}
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items class="k-stepper__items">
          <v-stepper-content class="k-stepper__content" :step="1">
            <ConfigureCompanyStepHeader
              class="mb-8 phishing-scenarios-fast-launch-step-1-header"
              :title="labels.CampaignSettings"
              :subtitle="labels.CampaignSettingsSub"
            />
            <CommonSimulatorFastLaunchStep1
              ref="refFastLaunch"
              :form-details="formDetails"
              :is-phishing="isPhishing"
              :isMFAScenarioSelected="isMFAScenarioSelected"
            />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="2">
            <ConfigureCompanyStepHeader
              :title="labels.CampaignSummary"
              :subtitle="labels.CampaignSummarySub"
            />
            <CampaignManagerSummary
              v-if="!isQuishingTypeIndividualPrintOut"
              ref="refCampaignManagerSummary"
              :type="type"
              :form-data="getFormDataForCampaignSummary"
              :language-options="languageOptions"
            />
            <CampaignManagerPrintoutSummary
              v-else
              ref="refCampaignManagerSummary"
              :type="type"
              :form-data="getFormDataForCampaignSummary"
              :language-options="languageOptions"
            />
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </template>
    <template #overlay-footer>
      <StepperFooter
        max-step="2"
        :ids="stepperIds"
        :step="step"
        :disabled-statuses="{
          nextButton: isActionButtonDisabled,
          submitButton: isActionButtonDisabled
        }"
        :saveButtonText="labels.Launch"
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
import CommonSimulatorFastLaunchStep1 from '@/components/Common/Simulator/CommonSimulatorFastLaunchStep1.vue'
import {
  createCampaignManager,
  getCampaignManagerFormDetails,
  getDefaultCompanySmtpSetting,
  getDefaultEmailDeliverySetting,
  getEmailDeliveries,
  getPhishingScenarioLandingPageAndEmailTemplate
} from '@/api/phishingsimulator'
import { getTargetGroupCountDetail } from '@/api/targetUsers'
import CampaignManagerSummary from '@/components/CampaignManager/Summary/CampaignManagerSummary'
import { difficulties, methods } from '@/components/CampaignManager/CampaignManagerInfo/utils'
import { isDifferent } from '@/utils/functions'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import StepperFooter from '@/components/Stepper/StepperFooter'
import { EMAIL_DELIVERY_TYPES } from '@/components/CampaignManager/AdvancedSettings/utils'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
import QuishingService from '@/api/quishing'
import { QUISHING_EMAIL_TEMPLATE_TYPES } from '@/components/QuishingEmailTemplates/utils'
import CampaignManagerPrintoutSummary from '@/components/CampaignManager/Summary/CampaignManagerPrintoutSummary.vue'
export default {
  name: 'CommonSimulatorFastLaunch',
  components: {
    CampaignManagerPrintoutSummary,
    StepperFooter,
    CampaignManagerSummary,
    CommonSimulatorFastLaunchStep1,
    ConfigureCompanyStepHeader,
    AppModal
  },
  props: {
    status: {
      type: Boolean
    },
    selectedScenario: {
      type: Object
    },
    type: {
      type: String,
      default: SCENARIO_TYPES.PHISHING
    },
    isPhishing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      labels,
      step: 1,
      stepperIds: {
        cancelButton: 'btn-cancel--scenarios-fast-launch-modal',
        backButton: 'btn-back--scenarios-fast-launch-modal',
        nextButton: 'btn-next--scenarios-fast-launch-modal',
        saveButton: 'btn-save--scenarios-fast-launch-modal'
      },
      isActionButtonDisabled: false,
      formDetails: {},
      smtpSettingResourceId: '',
      directEmailSettingResourceId: '',
      emailTemplate: null,
      emailTemplateParams: null,
      landingPageParams: null,
      landingPageTemplate: null,
      isSubmitted: false,
      languageOptions: []
    }
  },
  computed: {
    isQuishing() {
      return this.type === SCENARIO_TYPES.QUISHING
    },
    isQuishingTypeIndividualPrintOut() {
      if (!this.isQuishing) return false
      return (
        this?.selectedScenario?.quishingType?.toLowerCase() ===
        QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT.toLowerCase()
      )
    },
    isMFAScenarioSelected() {
      return this.selectedScenario?.method === 'MFA'
    },
    getTitle() {
      return `Fast Launch - ${this.selectedScenario.name}`
    },
    getFormDataForCampaignSummary() {
      let formData = {}
      if (this.step === 2) {
        const { refFastLaunch } = this.$refs
        const { refCampaignManagerCampaignInfo } = refFastLaunch.$refs
        formData = {
          ...refCampaignManagerCampaignInfo.formData,
          ...refFastLaunch.formData,
          emailTemplate: this.emailTemplate,
          sendingLimit: 50,
          duration: 3,
          emailTemplateParams: this.emailTemplateParams,
          landingPageTemplates: this.landingPageTemplate,
          landingPageParams: this.landingPageParams,
          userCountDetailResponse: this.userCountDetailResponse,
          selectedTargetGroups: refFastLaunch.selectedTargetGroups.map((tGroup) => ({
            name: tGroup.name,
            userCount: tGroup.userCount
          })),
          targetGroupResourceIds: refFastLaunch.selectedTargetGroups.map(
            (tGroup) => tGroup.resourceId
          )
        }
        formData.selectedPhishingScenarios = [this.selectedScenario]
        formData.selectedSchedule = 'Now'
        if (this.directEmailSettingResourceId) {
          formData.selectedEmailDelivery = {
            resourceId: this.directEmailSettingResourceId,
            name: 'Default',
            type: EMAIL_DELIVERY_TYPES.DIRECT_EMAIL
          }
        } else {
          formData.selectedEmailDelivery = {
            resourceId: this.smtpSettingResourceId,
            name: 'Default',
            type: EMAIL_DELIVERY_TYPES.SMTP
          }
        }
        formData.frequency = 'One Time'
        formData.templateType = this?.emailTemplateParams?.type
        formData.scenarioDistribution = 0
      }
      return formData
    }
  },
  created() {
    LookupLocalStorage.getSingle(21).then((response) => {
      this.languageOptions =
        response?.map((language) => ({
          text: language.isoFriendlyName,
          languageTypeName: language.name,
          description: language.description,
          value: language.resourceId
        })) || []
    })
    if (this.type === SCENARIO_TYPES.PHISHING) {
      this.callForDefaultEmailDeliverySetting()
    } else {
      this.callForDefaultSmtpSetting()
    }
    this.callForFormDetails()
    this.callForGetPhishingScenario()
  },
  methods: {
    callForDefaultSmtpSetting() {
      const apiFunc =
        this.type === SCENARIO_TYPES.PHISHING
          ? getDefaultCompanySmtpSetting
          : QuishingService.getDefaultCompanySmtpSetting
      apiFunc().then((response) => {
        const {
          data: { data }
        } = response
        this.smtpSettingResourceId = data.resourceId
      })
    },
    callForDefaultEmailDeliverySetting() {
      getDefaultEmailDeliverySetting().then((res) => {
        if (res?.data?.data?.type === 2) {
          this.directEmailSettingResourceId = res?.data?.data?.resourceId
          this.emailDeliverySettingType = EMAIL_DELIVERY_TYPES.DIRECT_EMAIL
        } else {
          // SMTP ise api den getirilecek
          getEmailDeliveries().then((res) => {
            const {
              data: {
                data: { results = [] }
              }
            } = res
            //first smtp item
            const smtpItem = results.find((item) => item.type === EMAIL_DELIVERY_TYPES.SMTP)
            this.smtpSettingResourceId = smtpItem.resourceId
            this.emailDeliverySettingType = EMAIL_DELIVERY_TYPES.SMTP
          })
        }
      })
    },
    callForFormDetails() {
      const apiFunc =
        this.type === SCENARIO_TYPES.PHISHING
          ? getCampaignManagerFormDetails
          : QuishingService.getCampaignManagerFormDetails
      apiFunc().then((response) => {
        const {
          data: { data }
        } = response
        this.formDetails = data
      })
    },
    callForGetPhishingScenario() {
      const apiFunc =
        this.type === SCENARIO_TYPES.PHISHING
          ? getPhishingScenarioLandingPageAndEmailTemplate
          : QuishingService.getQuishingScenarioLandingPageAndEmailTemplate
      const params = [this.selectedScenario.resourceId]
      if (this.type === SCENARIO_TYPES.QUISHING) {
        params.push(this.selectedScenario.quishingType)
      }
      apiFunc(...params).then((response) => {
        if (this?.$refs?.refFastLaunch?.$refs?.refCampaignManagerCampaignInfo) {
          this.$refs.refFastLaunch.$refs.refCampaignManagerCampaignInfo.setInitialName(
            this.selectedScenario.name
          )
        }
        const { data: { data = {} } = {} } = response
        let { emailTemplate, landingPageTemplate, quishingTemplate } = data
        if (this.isQuishingTypeIndividualPrintOut) emailTemplate = quishingTemplate

        const {
          template,
          fromName,
          fromAddress,
          name,
          difficultyResourceId,
          categoryResourceId,
          languageTypeResourceId,
          phishingFileName,
          type
        } = emailTemplate

        this.emailTemplateParams = {
          fromName,
          fromAddress,
          name,
          languageShortCode: this.languageOptions.find(
            (language) => language.value === languageTypeResourceId
          )?.text,
          method: methods.find((item) => item.value === categoryResourceId)?.text,
          difficulty: difficulties.find((item) => item.value === difficultyResourceId)?.text,
          phishingFileName,
          type
        }
        this.emailTemplate = template
        if (landingPageTemplate) {
          const {
            name: landingPageName,
            description,
            landingPages,
            urlTemplate,
            difficultyTypeId,
            methodTypeId,
            languageTypeResourceId
          } = landingPageTemplate
          this.landingPageParams = {
            name: landingPageName,
            description,
            urlTemplate,
            difficulty: difficulties[difficultyTypeId - 1].text,
            method: methods[methodTypeId - 1].text,
            languageShortCode: this.languageOptions.find(
              (language) => language.value === languageTypeResourceId
            )?.text
          }
          this.landingPageTemplate = landingPages
        }
      })
    },
    changeStep(flag = 1) {
      this.step += flag
    },
    closeOverlay() {
      const initialFormValues = {
        ...this.$refs.refFastLaunch.initialFormValues
      }
      const currentFormValues = {
        ...this.$refs.refFastLaunch.getCurrentFormValues()
      }
      const isChanged = isDifferent(currentFormValues, initialFormValues)
      if (!isChanged) {
        return this.$emit('on-close')
      }
      this.$store.dispatch('common/setIsShowLeavingDialog', {
        show: true,
        callback: () => {
          this.$emit('on-close')
        }
      })
    },
    setActionButtonDisability(flag = false) {
      this.isActionButtonDisabled = flag
    },
    async handleSubmit() {
      const { refFastLaunch } = this.$refs
      const {
        refCampaignManagerCampaignInfo,
        refCampaignManagerTargetAudience
      } = refFastLaunch.$refs
      const { formData } = refCampaignManagerCampaignInfo
      const { refForm } = refCampaignManagerCampaignInfo.$refs
      if (this.step === 1) {
        if (refForm.validate() && refFastLaunch.selectedTargetGroups?.length) {
          const selectedTargetGroupsMapped = refFastLaunch?.selectedTargetGroupsMapped || []
          const totalUserCount = selectedTargetGroupsMapped.reduce((acc, item) => {
            acc += item?.extraDatas.userCount || 0
            return acc
          }, 0)
          if (totalUserCount) {
            refCampaignManagerTargetAudience.isShowTargetGroupUsersError = false
            refCampaignManagerTargetAudience.isTargetGroupsValid = true
            const targetGroupResourceIds = refCampaignManagerTargetAudience.selectedTargetGroups.map(
              (group) => group.resourceId
            )
            this.setActionButtonDisability(true)
            this.userCountDetailResponse = await getTargetGroupCountDetail(targetGroupResourceIds)
            this.setActionButtonDisability(false)
            this.changeStep()
          } else {
            refCampaignManagerTargetAudience.isShowTargetGroupUsersError = true
            refCampaignManagerTargetAudience.isTargetGroupsValid = false
          }
        } else if (!refFastLaunch?.selectedTargetGroupsMapped.length) {
          refCampaignManagerTargetAudience.isTargetGroupsValid = false
        }
      } else if (this.step === 2) {
        this.setActionButtonDisability(true)
        const scenarioKey =
          this.type === SCENARIO_TYPES.PHISHING ? 'phishingScenarios' : 'quishingScenarios'
        const scenarioValueKey =
          this.type === SCENARIO_TYPES.PHISHING
            ? 'phishingScenarioResourceId'
            : 'quishingScenarioResourceId'
        const scenarioValue = [
          {
            [scenarioValueKey]: this.selectedScenario.resourceId,
            trainingId: '',
            trainingLanguageIds: []
          }
        ]
        const payload = {
          [scenarioKey]: scenarioValue,
          name: formData.name,
          scheduleTypeId: '1',
          duration: 365,
          targetGroupResourceIds: refFastLaunch.selectedTargetGroups.map(
            (tGroup) => tGroup.resourceId
          ),
          distributionTypeId: '1',
          distributionDelayEvery: 20,
          distributionDelayTimeTypeId: '1',
          distributionEmailOver: 8,
          distributionEmailOverTimeTypeId: '1',
          sendingLimit: 50,
          excludeFromReports: refFastLaunch.formData.excludeFromReports,
          sendOnlyActiveUsers: false,
          sendRandomlyUsers: refFastLaunch.formData.sendRandomlyUsers,
          sendRandomlyUsersCount: refFastLaunch.formData.sendRandomlyUsersCount,
          sendRandomlyUsersCalculateTypeId: refFastLaunch.formData.sendRandomlyUsersCalculateTypeId,
          emailDeliverySettingType: this.emailDeliverySettingType
        }
        if (this.emailDeliverySettingType === EMAIL_DELIVERY_TYPES.SMTP) {
          payload['smtpSettingResourceId'] = this.smtpSettingResourceId
        } else {
          payload['directEmailSettingResourceId'] = this.directEmailSettingResourceId
        }
        const apiFunc =
          this.type === SCENARIO_TYPES.PHISHING
            ? createCampaignManager
            : QuishingService.createCampaignManager
        apiFunc(payload)
          .then(() => {
            this.isSubmitted = true
            if (this.type === SCENARIO_TYPES.PHISHING) {
              this.$router.push({ name: 'Campaign Manager' })
            } else {
              this.$router.push({ name: 'Quishing Campaign Manager' })
            }
          })
          .finally(this.setActionButtonDisability)
      }
    }
  }
}
</script>
