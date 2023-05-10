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
          :instance-group="instanceGroup"
          :phishing-scenario-name="getPhishingScenarioName"
          :form-details="formDetails"
        />
      </el-tab-pane>
    </el-tabs>
  </KContainer>
</template>

<script>
import labels from '@/model/constants/labels'
import CampaignManagerReportSummary from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummary'
import CampaignManagerReportOpened from '@/components/CampaignManagerReport/Opened/CampaignManagerReportOpened'
import CampaignManagerReportClicked from '@/components/CampaignManagerReport/Clicked/CampaignManagerReportClicked'
import CampaignManagerReportSubmittedData from '@/components/CampaignManagerReport/SubmittedData/CampaignManagerReportSubmittedData'
import CampaignManagerReportOpenedAttachment from '@/components/CampaignManagerReport/OpenedAttachment/CampaignManagerReportOpenedAttachment'
import CampaignManagerReportNoResponse from '@/components/CampaignManagerReport/NoResponse/CampaignManagerReportNoResponse'
import CampaignManagerReportSendingReport from '@/components/CampaignManagerReport/SendingReport/CampaignManagerReportSendingReport'
import { getCampaignManagerJobFormDetails, getCampaignJobSummary } from '@/api/phishingsimulator'
import CampaignManagerReportPhishingReport from '@/components/CampaignManagerReport/PhishingReport/CampaignManagerReportPhishingReport'
import KContainer from '@/components/KContainer/KContainer'

export default {
  name: 'CampaignManagerReport',
  components: { KContainer },
  data() {
    return {
      isLoading: true,
      tab: labels.Summary,
      tabItems: [
        {
          name: labels.Summary,
          id: 'campaign-manager-report-summary-content',
          label: labels.Summary,
          component: CampaignManagerReportSummary,
          isVisible: this.$store.getters['permissions/getCampaignReportsGetPermissions']
        },
        {
          name: labels.Opened,
          id: 'campaign-manager-report-opened-content',
          label: labels.Opened,
          component: CampaignManagerReportOpened,
          isVisible: this.$store.getters['permissions/getCampaignReportsOpenedPermissions']
        },
        {
          name: labels.Clicked,
          id: 'campaign-manager-report-clicked-content',
          label: labels.Clicked,
          component: CampaignManagerReportClicked,
          isVisible: this.$store.getters['permissions/getCampaignReportsClickedPermissions']
        },
        {
          name: labels.SubmittedData,
          id: 'campaign-manager-report-submitted-date-content',
          label: labels.SubmittedData,
          component: CampaignManagerReportSubmittedData,
          isVisible: this.$store.getters['permissions/getCampaignReportsSubmittedDataPermissions']
        },
        {
          name: labels.NoResponse,
          id: 'campaign-manager-report-no-response-content',
          label: labels.NoResponse,
          component: CampaignManagerReportNoResponse,
          isVisible: this.$store.getters['permissions/getCampaignReportsNoResponsePermissions']
        },
        {
          name: labels.PhishingReporter,
          id: 'campaign-manager-report-phishing-report-content',
          label: labels.Reporters,
          component: CampaignManagerReportPhishingReport,
          isVisible: this.$store.getters[
            'permissions/getCampaignReportsPhishingReporterPermissions'
          ]
        },
        {
          name: labels.SendingReport,
          id: 'campaign-manager-report-sending-response-content',
          label: labels.SendingReport,
          component: CampaignManagerReportSendingReport,
          isVisible: this.$store.getters['permissions/getCampaignReportsSendingReportPermissions']
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
    this.callForFormDetails()
  },
  methods: {
    callForFormDetails() {
      getCampaignManagerJobFormDetails().then((response) => {
        this.formDetails = response?.data?.data
      })
    },
    setSubmittedDataTabLabel() {
      if (!this.id || !this.instanceGroup) return
      getCampaignJobSummary(this.id, this.instanceGroup)
        .then((response) => {
          const firstScenario = response?.data?.data?.scenarios[0]
          if (!firstScenario) return
          if (firstScenario.scenarioInfo?.methodTypeId === 1) {
            const tabIndex = this.tabItems.findIndex((tab) => tab.name === labels.SubmittedData)
            this.tabItems.splice(tabIndex, 1)
          } else if (firstScenario.scenarioInfo?.methodTypeId === 3) {
            const tabIndex = this.tabItems.findIndex((tab) => tab.name === labels.SubmittedData)
            if (tabIndex !== -1) {
              this.tabItems[tabIndex] = {
                label: labels.OpenedAttachment,
                name: labels.OpenedAttachment,
                id: 'campaign-manager-report-opened-attachment-content',
                component: CampaignManagerReportOpenedAttachment,
                isVisible: this.$store.getters[
                  'permissions/getCampaignReportsOpenedAttachmentPermissions'
                ]
              }
            }
            const clickedTabIndex = this.tabItems.findIndex((tab) => tab.name === labels.Clicked)
            if (clickedTabIndex !== -1) {
              this.tabItems.splice(clickedTabIndex, 1)
            }
          }
        })
        .finally(() => {
          this.isLoading = false
        })
    }
  }
}
</script>
