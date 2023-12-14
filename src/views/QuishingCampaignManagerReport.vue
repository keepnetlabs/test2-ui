<template>
  <KContainer id="quishing-campaign-manager-report">
    <ElTabs v-model="tab">
      <ElTabPane
        v-for="item in tabItems"
        v-if="item.isVisible"
        :key="item.name"
        :id="item.id"
        :name="item.name"
        :label="item.label"
        :disabled="isLoading"
      >
        <span slot="label">
          <VSkeletonLoader v-if="isLoading" :loading="isLoading" type="chip" />
          <template v-else> {{ item.label }} </template>
        </span>
        <component
          v-if="item.name === tab"
          :is="item.component"
          :id="id"
          :custom-fields="customFields"
          :instance-group="instanceGroup"
          :phishing-scenario-name="getQuishingScenarioName"
          :form-details="formDetails"
          :multiple-type="multipleType"
          :api-response="apiResponse"
        />
      </ElTabPane>
    </ElTabs>
  </KContainer>
</template>
<script>
import KContainer from '@/components/KContainer/KContainer.vue'
import labels from '@/model/constants/labels'
import { getTargetUserCustomFieldsByCompanyId } from '@/api/targetUsers'
import CampaignManagerReportOpenedAttachment from '@/components/QuishingCampaignManagerReport/OpenedAttachment/CampaignManagerReportOpenedAttachment.vue'
import CampaignManagerReportSubmittedMfaCode from '@/components/QuishingCampaignManagerReport/SubmittedMfaCode/CampaignManagerReportSubmittedMfaCode.vue'
import CampaignManagerReportSummary from '@/components/QuishingCampaignManagerReport/Summary/CampaignManagerReportSummary.vue'
import CampaignManagerReportOpened from '@/components/QuishingCampaignManagerReport/Opened/CampaignManagerReportOpened.vue'
import CampaignManagerReportClicked from '@/components/QuishingCampaignManagerReport/Clicked/CampaignManagerReportClicked.vue'
import CampaignManagerReportSubmittedData from '@/components/QuishingCampaignManagerReport/SubmittedData/CampaignManagerReportSubmittedData.vue'
import CampaignManagerReportNoResponse from '@/components/QuishingCampaignManagerReport/NoResponse/CampaignManagerReportNoResponse.vue'
import CampaignManagerReportPhishingReport from '@/components/QuishingCampaignManagerReport/PhishingReport/CampaignManagerReportPhishingReport.vue'
import CampaignManagerReportSendingReport from '@/components/QuishingCampaignManagerReport/SendingReport/CampaignManagerReportSendingReport.vue'
import QuishingService from '@/api/quishing'
import { QUISHING_EMAIL_TEMPLATE_TYPES } from '@/components/QuishingEmailTemplates/utils'
export default {
  name: 'QuishingCampaignManagerReport',
  components: { KContainer },
  data() {
    return {
      formDetails: null,
      renderClickedTab: false,
      customFields: [],
      isLoading: true,
      tab: labels.Summary,
      apiResponse: {},
      multipleType: [],
      tabItems: [
        {
          name: labels.Summary,
          id: 'campaign-manager-report-summary-content',
          label: labels.Summary,
          component: CampaignManagerReportSummary,
          isVisible: this.$store.getters['permissions/getQuishingCampaignReportsGetPermissions']
        },
        {
          name: labels.Opened,
          id: 'campaign-manager-report-opened-content',
          label: labels.Opened,
          component: CampaignManagerReportOpened,
          isVisible: this.$store.getters['permissions/getQuishingCampaignReportsOpenedPermissions']
        },
        {
          name: labels.Clicked,
          id: 'campaign-manager-report-clicked-content',
          label: labels.ScannedQRLink,
          component: CampaignManagerReportClicked,
          isVisible: this.$store.getters['permissions/getQuishingCampaignReportsClickedPermissions']
        },
        {
          name: labels.SubmittedData,
          id: 'campaign-manager-report-submitted-date-content',
          label: labels.SubmittedData,
          component: CampaignManagerReportSubmittedData,
          isVisible: this.$store.getters[
            'permissions/getQuishingCampaignReportsSubmittedDataPermissions'
          ]
        },
        {
          name: labels.NoResponse,
          id: 'campaign-manager-report-no-response-content',
          label: labels.NoResponse,
          component: CampaignManagerReportNoResponse,
          isVisible: this.$store.getters[
            'permissions/getQuishingCampaignReportsNoResponsePermissions'
          ]
        },
        {
          name: labels.PhishingReporter,
          id: 'campaign-manager-report-phishing-report-content',
          label: labels.Reporters,
          component: CampaignManagerReportPhishingReport,
          isVisible: this.$store.getters[
            'permissions/getQuishingCampaignReportsPhishingReporterPermissions'
          ]
        },
        {
          name: labels.SendingReport,
          id: 'campaign-manager-report-sending-response-content',
          label: labels.SendingReport,
          component: CampaignManagerReportSendingReport,
          isVisible: this.$store.getters[
            'permissions/getQuishingCampaignReportsSendingReportPermissions'
          ]
        }
      ]
    }
  },
  computed: {
    id() {
      return this.$route?.params?.id
    },
    instanceGroup() {
      return this.$route?.params?.instanceGroup
    },
    getQuishingScenarioName() {
      return this.$store?.state?.common?.activePageRouterName || ''
    }
  },
  watch: {
    '$route.params.id': {
      handler: function (id) {
        if (id) {
          this.setSubmittedDataTabLabel()
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.callForCustomFields()
    this.callForFormDetails()
  },
  methods: {
    callForCustomFields() {
      getTargetUserCustomFieldsByCompanyId().then((response) => {
        this.customFields = response?.data?.data
      })
    },
    callForFormDetails() {
      QuishingService.getCampaignManagerJobFormDetails().then((response) => {
        this.formDetails = response?.data?.data
      })
    },
    setSubmittedDataTabLabel() {
      if (!this.id || !this.instanceGroup) return
      QuishingService.getCampaignJobSummary(this.id, this.instanceGroup)
        .then((response) => {
          this.apiResponse = response
          const scenarios = response?.data?.data?.scenarios || []
          const firstScenario = scenarios[0]
          if (!firstScenario || !scenarios.length) return
          if (scenarios.length === 1) {
            const scenarioMethodType = firstScenario.scenarioInfo?.methodTypeId
            if (scenarioMethodType === 1) {
              const tabIndex = this.tabItems.findIndex((tab) => tab.name === labels.SubmittedData)
              this.tabItems.splice(tabIndex, 1)
            } else if (scenarioMethodType === 3) {
              const tabIndex = this.tabItems.findIndex((tab) => tab.name === labels.SubmittedData)
              if (tabIndex !== -1) {
                this.tabItems[tabIndex] = {
                  label: labels.OpenedAttachment,
                  name: labels.OpenedAttachment,
                  id: 'campaign-manager-report-opened-attachment-content',
                  component: CampaignManagerReportOpenedAttachment,
                  isVisible: this.$store.getters[
                    'permissions/getQuishingCampaignReportsOpenedAttachmentPermissions'
                  ]
                }
              }
              const clickedTabIndex = this.tabItems.findIndex((tab) => tab.name === labels.Clicked)
              if (clickedTabIndex !== -1) {
                this.tabItems.splice(clickedTabIndex, 1)
              }
            } else if (scenarioMethodType === 4) {
              this.setMultipleType(scenarios)
              this.setTabStatus()
            }
            if (
              firstScenario?.scenarioInfo?.templateType?.toString().toLowerCase() ===
              QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT
            ) {
              const phishingReportIndex = this.tabItems.findIndex(
                (tab) => tab.name === labels.PhishingReporter
              )
              if (phishingReportIndex !== -1) this.tabItems.splice(phishingReportIndex, 1)
            }
          } else {
            this.setMultipleType(scenarios)
            this.setTabStatus()
          }
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    setMultipleType(scenarios = []) {
      let isClickedOnly, isSubmittedData, isAttachment, isMfa
      const setMethodValues = (method = '') => {
        if (method === '1') {
          isClickedOnly = true
        } else if (method === '2') {
          isSubmittedData = true
          this.renderClickedTab = true
        } else if (method === '3') {
          isAttachment = true
        }
      }
      scenarios.forEach((scenario) => {
        const method = scenario.scenarioInfo.methodTypeId.toString()
        if (method === '4') {
          isMfa = true
          setMethodValues(scenario.landingPageTemplateInfo?.methodTypeId.toString())
        } else {
          setMethodValues(method)
        }
      })
      this.multipleType = [isClickedOnly, isSubmittedData, isAttachment, isMfa]
    },
    setTabStatus() {
      //click only
      if (!this.multipleType[0] && !this.renderClickedTab) {
        const tabIndex = this.tabItems.findIndex((tab) => tab.name === labels.Clicked)
        if (tabIndex) this.tabItems.splice(tabIndex, 1)
      }
      //data submission
      if (!this.multipleType[1]) {
        const tabIndex = this.tabItems.findIndex((tab) => tab.name === labels.SubmittedData)
        if (tabIndex) this.tabItems.splice(tabIndex, 1)
      }
      //attachment
      if (this.multipleType[2]) {
        this.tabItems.splice(3, 0, {
          label: labels.OpenedAttachment,
          name: labels.OpenedAttachment,
          id: 'campaign-manager-report-opened-attachment-content',
          component: CampaignManagerReportOpenedAttachment,
          isVisible: this.$store.getters[
            'permissions/getQuishingCampaignReportsOpenedAttachmentPermissions'
          ]
        })
      }
      //mfa
      if (this.multipleType[3]) {
        this.tabItems.splice(3, 0, {
          name: labels.SubmittedMFACode,
          id: 'campaign-manager-report-submitted-mfa-content',
          label: labels.SubmittedMFACode,
          component: CampaignManagerReportSubmittedMfaCode,
          isVisible: this.$store.getters[
            'permissions/getQuishingCampaignReportsSubmittedDataPermissions'
          ]
        })
      }
    }
  }
}
</script>
