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
          :languageItems="languageItems"
        />
      </el-tab-pane>
    </el-tabs>
  </KContainer>
</template>

<script>
import labels from '@/model/constants/labels'
import CampaignManagerReportSummary from '@/components/CallbackReport/Summary/CampaignManagerReportSummary'
import CampaignManagerReportOpened from '@/components/CallbackReport/Opened/CampaignManagerReportOpened'
import CampaignManagerReportNoResponse from '@/components/CallbackReport/NoResponse/CampaignManagerReportNoResponse'
import CallbackReportReporters from '@/components/CallbackReport/PhishingReport/CampaignManagerReportPhishingReport'
import CampaignManagerReportSendingReport from '@/components/CallbackReport/SendingReport/CampaignManagerReportSendingReport'
import CallbackReportCalledBack from '@/components/CallbackReport/CalledBack/CallbackReportCalledBack'
import CallbackReportEnteredDigits from '@/components/CallbackReport/EnteredDigits/CallbackReportEnteredDigits'
import CallbackService from '@/api/callback'
import { getTargetUserCustomFieldsByCompanyId } from '@/api/targetUsers'
import KContainer from '@/components/KContainer/KContainer'

export default {
  name: 'CallbackReport',
  components: { KContainer },
  data() {
    return {
      languageItems: [],
      customFields: [],
      isLoading: false,
      tab: labels.Summary,
      apiResponse: {},
      // TODO: Change permissions
      tabItems: [
        {
          name: labels.Summary,
          id: 'callback-report-summary-content',
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
        {
          name: labels.Opened,
          id: 'callback-report-opened-content',
          label: labels.Opened,
          component: CampaignManagerReportOpened,
          isVisible: this.$store.getters['permissions/getCampaignReportsOpenedPermissions']
        },
        {
          name: `Called Back`,
          id: 'callback-report-called-back-content',
          label: `Called Back`,
          component: CallbackReportCalledBack,
          isVisible: this.$store.getters['permissions/getSmishingReportSearchTypePermissions']
        },
        {
          name: `Entered Digits`,
          id: 'callback-report-entered-digits-content',
          label: `Entered Digits`,
          component: CallbackReportEnteredDigits,
          isVisible: this.$store.getters['permissions/getSmishingReportSearchTypePermissions']
        },
        {
          name: `No Response`,
          id: 'callback-report-no-response-content',
          label: `No Response`,
          component: CampaignManagerReportNoResponse,
          isVisible: this.$store.getters['permissions/getSmishingReportSearchTypePermissions']
        },
        {
          name: `Reporters`,
          id: 'callback-report-reporters-content',
          label: `Reporters`,
          component: CallbackReportReporters,
          isVisible: this.$store.getters['permissions/getSmishingReportSearchTypePermissions']
        },
        {
          name: labels.SendingReport,
          id: 'callback-report-sending-response-content',
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
  created() {
    this.callForLanguages()
    this.callForSummary()
    this.callForCustomFields()
    this.callForFormDetails()
  },
  methods: {
    callForLanguages() {
      CallbackService.getCallbackTemplateLanguages().then((response) => {
        this.languageItems = response?.data?.data || []
      })
    },
    callForSummary() {
      CallbackService.getCampaignSummary(this.id, this.instanceGroup)
        .then((response) => {
          this.apiResponse = response
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    callForCustomFields() {
      getTargetUserCustomFieldsByCompanyId().then((response) => {
        this.customFields = response?.data?.data
      })
    },
    callForFormDetails() {
      CallbackService.getCampaignManagerFormDetails().then((response) => {
        this.formDetails = response?.data?.data
      })
    }
  }
}
</script>
