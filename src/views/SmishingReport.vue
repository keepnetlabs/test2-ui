<template>
  <KContainer id="campaign-manager-report">
    <el-tabs v-model="tab">
      <el-tab-pane
        v-for="item in tabItems"
        v-if="item.isVisible"
        :key="item.name"
        :id="item.id"
        :name="item.name"
        :label="item.label"
        :disabled="isLoading"
      >
        <span slot="label">
          <v-skeleton-loader v-if="isLoading" :loading="isLoading" type="chip" />
          <template v-else> {{ item.label }} </template>
        </span>
        <component
          v-if="item.name === tab"
          :is="item.component"
          :id="id"
          :custom-fields="customFields"
          :instance-group="instanceGroup"
          :phishing-scenario-name="getPhishingScenarioName"
          :form-details="formDetails"
          :api-response="apiResponse"
        />
      </el-tab-pane>
    </el-tabs>
  </KContainer>
</template>

<script>
import labels from '@/model/constants/labels'
import CampaignManagerReportSummary from '@/components/SmishingReport/Summary/CampaignManagerReportSummary'
// import SmishingReportUsers from '@/components/SmishingReport/Users/CampaignReportUsers'
import CampaignManagerReportClicked from '@/components/SmishingReport/Clicked/CampaignManagerReportClicked'
// import CampaignManagerReportOpened from '@/components/SmishingReport/Opened/CampaignManagerReportOpened'
import CampaignManagerReportSubmittedData from '@/components/SmishingReport/SubmittedData/CampaignManagerReportSubmittedData'
import CampaignManagerReportSubmittedMFACode from '@/components/SmishingReport/SubmittedMFACode/CampaignManagerReportSubmittedMFACode'
import CampaignManagerReportNoResponse from '@/components/SmishingReport/NoResponse/CampaignManagerReportNoResponse'
import CampaignManagerReportSendingReport from '@/components/SmishingReport/SendingReport/CampaignManagerReportSendingReport'
import SmishingService from '@/api/smishing'
import { getTargetUserCustomFieldsByCompanyId } from '@/api/targetUsers'
import KContainer from '@/components/KContainer/KContainer'

export default {
  name: 'SmishingReport',
  components: { KContainer },
  provide() {
    return {
      campaignDurationExpired: () => this.campaignDurationExpired
    }
  },
  data() {
    return {
      customFields: [],
      isLoading: true,
      tab: labels.Summary,
      apiResponse: {},
      campaignDurationExpired: false,
      tabItems: [
        {
          name: labels.Summary,
          id: 'smishing-report-summary-content',
          label: labels.Summary,
          component: CampaignManagerReportSummary,
          isVisible: this.$store.getters['permissions/getSmishingReportSummaryPermissions']
        },
        // {
        //   name: labels.Users,
        //   id: 'smishing-report-users-content',
        //   label: labels.Users,
        //   component: SmishingReportUsers,
        //   isVisible: this.$store.getters['permissions/getSmishingReportSummaryPermissions']
        // },
        // {
        //   name: labels.Opened,
        //   id: 'campaign-manager-report-opened-content',
        //   label: labels.Opened,
        //   component: CampaignManagerReportOpened,
        //   isVisible: this.$store.getters['permissions/getCampaignReportsOpenedPermissions']
        // },
        {
          name: labels.Clicked,
          id: 'smishing-report-clicked-content',
          label: labels.Clicked,
          component: CampaignManagerReportClicked,
          isVisible: this.$store.getters['permissions/getSmishingReportSearchTypePermissions']
        },
        {
          name: labels.NoResponse,
          id: 'smishing-report-no-response-content',
          label: labels.NoResponse,
          component: CampaignManagerReportNoResponse,
          isVisible: this.$store.getters['permissions/getSmishingReportSearchTypePermissions']
        },
        {
          name: labels.SendingReport,
          id: 'campaign-manager-report-sending-response-content',
          label: labels.SendingReport,
          component: CampaignManagerReportSendingReport,
          isVisible: this.$store.getters['permissions/getSmishingReportSearchTypePermissions']
        }
      ],
      formDetails: null
    }
  },
  computed: {
    id() {
      return this.$route?.params?.id
    },
    instanceGroup() {
      return this.$route?.params?.instanceGroup
    },
    getPhishingScenarioName() {
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
      SmishingService.getCampaignFormDetails().then((response) => {
        this.formDetails = response?.data?.data
      })
    },
    setSubmittedDataTabLabel() {
      if (!this.id || !this.instanceGroup) return
      SmishingService.getCampaignJobSummary(this.id, this.instanceGroup)
        .then((response) => {
          this.apiResponse = response
          this.campaignDurationExpired = response?.data?.data?.campaignDurationExpired || false
          const scenarios = response?.data?.data?.scenarios || []
          const firstScenario = scenarios[0]
          if (!firstScenario || !scenarios.length) return
          const isSubmittedData = scenarios.some(
            (scenario) => scenario.landingPageTemplateInfo.methodTypeId.toString() === '2'
          )
          const isSubmittedMFA = scenarios.some(
            (scenario) => scenario.scenarioInfo.methodTypeId.toString() === '4'
          )
          if (isSubmittedData) {
            this.tabItems.splice(this.tabItems.length - 2, 0, {
              name: labels.SubmittedData,
              id: 'smishing-report-submitted-data-content',
              label: labels.SubmittedData,
              component: CampaignManagerReportSubmittedData,
              isVisible: this.$store.getters['permissions/getSmishingReportSearchTypePermissions']
            })
          }
          if (isSubmittedMFA) {
            this.tabItems.splice(this.tabItems.length - 2, 0, {
              name: 'Submitted MFA Code',
              id: 'smishing-report-submitted-mfa-code-content',
              label: 'Submitted MFA Code',
              component: CampaignManagerReportSubmittedMFACode,
              isVisible: this.$store.getters['permissions/getSmishingReportSearchTypePermissions']
            })
          }
        })
        .finally(() => {
          this.isLoading = false
        })
    }
  }
}
</script>
