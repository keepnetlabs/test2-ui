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
            id="step--campaign-manager-add-or-edit-modal-campaign-summary"
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
            <PhishingScenariosFastLaunchStep1 ref="refFastLaunch" :form-details="formDetails" />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="2">
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
      <v-btn
        @click="closeOverlay"
        id="btn-cancel--add-or-edit-company-manager-modal"
        class="add-in-configuration__footer-btn-cancel"
        rounded
      >
        {{ labels.Cancel }}
      </v-btn>
      <div class="add-in-configuration__footer__right-col">
        <v-btn
          @click="changeStep(-1)"
          id="btn-back--add-or-edit-company-manager-modal"
          class="add-in-configuration__footer-btn-back mr-4"
          rounded
          v-if="step > 1"
        >
          {{ labels.Back }}
        </v-btn>

        <v-btn
          id="btn-next--add-or-edit-company-manager-modal"
          class="add-in-configuration__footer-btn-next"
          color="#2196f3"
          rounded
          :disabled="isActionButtonDisabled"
          @click="handleSubmit"
        >
          {{ [1].includes(step) ? labels.Next : labels.Start }}
        </v-btn>
      </div>
    </template>
  </AppModal>
</template>

<script>
import AppModal from '@/components/AppModal'
import labels from '@/model/constants/labels'
import ConfigureCompanyStepHeader from '@/components/Companies/ConfigureCompanyStepHeader'
import PhishingScenariosFastLaunchStep1 from '@/components/PhishingScenarios/FastLaunch/PhishingScenariosFastLaunchStep1'
import {
  createCampaignManager,
  getCampaignManagerFormDetails,
  getDefaultCompanySmtpSetting,
  getPhishingScenarioLandingPageAndEmailTemplate
} from '@/api/phishingsimulator'
import CampaignManagerSummary from '@/components/CampaignManager/Summary/CampaignManagerSummary'
import { getScenario } from '@/api/scenarios'
import { difficulties, methods } from '@/components/CampaignManager/CampaignManagerInfo/utils'
import { searchTargetGroups } from '@/api/targetUsers'
export default {
  name: 'PhishingScenariosFastLaunch',
  components: {
    CampaignManagerSummary,
    PhishingScenariosFastLaunchStep1,
    ConfigureCompanyStepHeader,
    AppModal
  },
  props: {
    status: {
      type: Boolean
    },
    selectedScenario: {
      type: Object
    }
  },
  data() {
    return {
      labels,
      step: 1,
      isActionButtonDisabled: false,
      formDetails: {},
      smtpSettingResourceId: '',
      emailTemplate: null,
      emailTemplateParams: null,
      landingPageParams: null,
      landingPageTemplate: null
    }
  },
  computed: {
    getTitle() {
      return `Fast Launch - ${this.selectedScenario.name}`
    },
    getFormDataForCampaignSummary() {
      let formData = {}
      if (this.step === 2) {
        const { refFastLaunch } = this.$refs
        const { refCampaignManagerCampaignInfo } = refFastLaunch.$refs
        formData = {
          ...formData,
          ...refCampaignManagerCampaignInfo.formData,
          ...refFastLaunch.formData,
          emailTemplate: this.emailTemplate,
          sendingLimit: 50,
          duration: 3,
          emailTemplateParams: this.emailTemplateParams,
          landingPageTemplate: this.landingPageTemplate,
          landingPageParams: this.landingPageParams
        }

        formData.selectedPhishingScenario = this.selectedScenario

        formData.selectedSchedule = 'Now'
        formData.selectedSmtpSetting = { resourceId: this.smtpSettingResourceId, name: 'Default' }
      }
      return formData
    }
  },
  created() {
    this.callForDefaultSmtpSetting()
    this.callForFormDetails()
    this.callForGetPhishingScenario()
  },
  methods: {
    callForDefaultSmtpSetting() {
      getDefaultCompanySmtpSetting().then((response) => {
        const {
          data: { data }
        } = response
        this.smtpSettingResourceId = data.resourceId
      })
    },
    callForFormDetails() {
      getCampaignManagerFormDetails().then((response) => {
        const {
          data: { data }
        } = response
        this.formDetails = data
      })
    },
    callForGetPhishingScenario() {
      getScenario(this.selectedScenario.resourceId).then((response) => {
        const {
          data: { data }
        } = response
        this.$refs.refFastLaunch.$refs.refCampaignManagerCampaignInfo.formData.name = this.selectedScenario.name
        const { emailTemplateResourceId, landingPageTemplateResourceId } = data
        getPhishingScenarioLandingPageAndEmailTemplate(
          emailTemplateResourceId,
          landingPageTemplateResourceId
        ).then((response) => {
          const { data: { data = {} } = {} } = response
          const { emailTemplate, landingPageTemplate } = data
          const { template, fromName, fromAddress, name, difficultyResourceId } = emailTemplate

          this.emailTemplateParams = {
            fromName,
            fromAddress,
            name,
            difficulty: difficulties.find((item) => item.value === difficultyResourceId)?.text
          }
          this.emailTemplate = template
          const {
            name: landingPageName,
            description,
            landingPages,
            urlTemplate,
            difficultyTypeId,
            methodTypeId
          } = landingPageTemplate
          this.landingPageParams = {
            name: landingPageName,
            description,
            urlTemplate,
            difficulty: difficulties[difficultyTypeId - 1].text,
            method: methods[methodTypeId - 1].text
          }
          this.landingPageTemplate = landingPages[0].content
        })
      })
    },
    changeStep(flag = 1) {
      this.step += flag
    },
    closeOverlay() {
      this.$emit('on-close')
    },
    setActionButtonDisability(flag = false) {
      this.isActionButtonDisabled = flag
    },
    handleSubmit() {
      const { refFastLaunch } = this.$refs
      const { refCampaignManagerCampaignInfo } = refFastLaunch.$refs
      const { formData } = refCampaignManagerCampaignInfo
      const { refForm } = refCampaignManagerCampaignInfo.$refs

      switch (this.step) {
        case 1:
          if (refForm.validate()) {
            const ids = refCampaignManagerCampaignInfo.formData.targetGroupResourceIds.map(
              (item) => item.value
            )
            searchTargetGroups({
              pageNumber: 1,
              pageSize: 2000000,
              orderBy: 'CreateTime',
              ascending: false,
              filter: {
                Condition: 'AND',
                FilterGroups: [
                  {
                    Condition: 'AND',
                    FilterItems: [],
                    FilterGroups: []
                  },
                  {
                    Condition: 'OR',
                    FilterItems: [
                      { FieldName: 'resourceId', Value: ids.join(','), Operator: 'Include' }
                    ],
                    FilterGroups: []
                  }
                ]
              }
            }).then((response) => {
              refCampaignManagerCampaignInfo.formData.selectedTargetGroups =
                response.data.data.results
              this.changeStep()
            })
          } else this.showErrorMessage(refForm)
          break
        case 2:
          this.setActionButtonDisability(true)
          const payload = {
            name: formData.name,
            phishingScenarioResourceId: this.selectedScenario.resourceId,
            scheduleTypeId: '1',
            duration: 3,
            targetGroupResourceIds: formData.targetGroupResourceIds.map((item) => item.value),
            distributionTypeId: '1',
            distributionSmtpDelayEvery: 20,
            distributionSmtpDelayTimeTypeId: '1',
            distributionEmailOver: 8,
            distributionEmailOverTimeTypeId: '1',
            sendingLimit: 50,
            excludeFromReports: refFastLaunch.formData.excludeFromReports,
            sendOnlyActiveUsers: false,
            sendRandomlyUsers: refFastLaunch.formData.sendRandomlyUsers,
            sendRandomlyUsersCount: refFastLaunch.formData.sendRandomlyUsersCount,
            sendRandomlyUsersCalculateTypeId:
              refFastLaunch.formData.sendRandomlyUsersCalculateTypeId,
            smtpSettingResourceId: this.smtpSettingResourceId
          }
          createCampaignManager(payload)
            .then(() => {
              this.$router.push({ name: 'Campaign Manager' })
            })
            .finally(this.setActionButtonDisability)
        default:
          break
      }
    }
  }
}
</script>

<style lang="scss">
.phishing-scenarios-fast-launch-step-1-header {
  .add-in-configuration__subtitle {
    max-width: 554px;
    white-space: normal;
  }
}
</style>
