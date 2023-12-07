<template>
  <KContainer id="training-report">
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
          :isLoading="isLoading"
          :training-name="getTrainingName"
          :form-details="formDetails"
          :trainingSummary="trainingSummary"
          :isScormProxy="isScormProxy"
        />
      </el-tab-pane>
    </el-tabs>
  </KContainer>
</template>

<script>
import labels from '@/model/constants/labels'
import TrainingReportClickedTrainingLink from '@/components/ScormProxyReport/ClickedTrainingLink/TrainingReportClickedTrainingLink'
import TrainingReportExamResults from '@/components/ScormProxyReport/ExamResults/TrainingReportExamResults'
import TrainingReportNoResponse from '@/components/ScormProxyReport/NoResponse/TrainingReportNoResponse'
import TrainingReportOpenedTrainingEmail from '@/components/ScormProxyReport/OpenedTrainingEmail/TrainingReportOpenedTrainingEmail'
import TrainingReportProgress from '@/components/ScormProxyReport/Progress/TrainingReportProgress'
import TrainingReportSummary from '@/components/ScormProxyReport/Summary/TrainingReportSummary'
import TrainingReportUsers from '@/components/ScormProxyReport/Users/TrainingReportUsers'
import TrainingReportSendingReport from '@/components/ScormProxyReport/SendingReport/TrainingReportSendingReport'
import KContainer from '@/components/KContainer/KContainer'
import AwarenessEducatorService from '@/api/awarenessEducator'

export default {
  name: 'ScormProxyReport',
  components: { KContainer },
  data() {
    return {
      trainingSummary: null,
      isLoading: false,
      tab: labels.Summary,
      tabItems: [
        {
          name: labels.Summary,
          id: 'training-report-summary-content',
          label: labels.Summary,
          component: TrainingReportSummary,
          // isVisible: this.$store.getters['permissions/getCampaignReportsGetPermissions']
          isVisible: true
        },
        {
          name: labels.Users,
          id: 'training-report-users-content',
          label: labels.Users,
          component: TrainingReportUsers,
          // isVisible: this.$store.getters['permissions/getCampaignReportsOpenedPermissions']
          isVisible: true
        },
        {
          name: labels.OpenedTrainingEmail,
          id: 'training-report-opened-content',
          label: labels.OpenedTrainingEmail,
          component: TrainingReportOpenedTrainingEmail,
          // isVisible: this.$store.getters['permissions/getCampaignReportsClickedPermissions']
          isVisible: true
        },
        {
          name: labels.ClickedTrainingLink,
          id: 'training-report-clicked-content',
          label: labels.ClickedTrainingLink,
          component: TrainingReportClickedTrainingLink,
          // isVisible: this.$store.getters['permissions/getCampaignReportsSubmittedDataPermissions']
          isVisible: true
        },
        {
          name: labels.Progress,
          id: 'training-report-progress-content',
          label: labels.Progress,
          component: TrainingReportProgress,
          // isVisible: this.$store.getters['permissions/getCampaignReportsNoResponsePermissions']
          isVisible: true
        },
        {
          name: labels.ExamResults,
          id: 'training-report-exam-results-content',
          label: labels.ExamResults,
          component: TrainingReportExamResults,
          // isVisible: this.$store.getters[
          //   'permissions/getCampaignReportsPhishingReporterPermissions'
          // ],
          isVisible: true
        },
        {
          name: labels.NoResponse,
          id: 'training-report-no-response-content',
          label: labels.NoResponse,
          component: TrainingReportNoResponse,
          // isVisible: this.$store.getters['permissions/getCampaignReportsSendingReportPermissions']
          isVisible: true
        },
        {
          name: labels.SendingReport,
          id: 'training-report-sending-report-content',
          label: labels.SendingReport,
          component: TrainingReportSendingReport,
          // isVisible: this.$store.getters['permissions/getCampaignReportsSendingReportPermissions']
          isVisible: true
        }
      ],
      formDetails: null
    }
  },
  computed: {
    id() {
      return this.$route?.params?.id
    },
    getTrainingName() {
      return this.$store?.state?.common?.activePageRouterName || 'Training Name'
    },
    isScormProxy() {
      return this.trainingSummary?.isScormProxy || false
    }
  },
  created() {
    this.callForFormDetails()
    this.callForSummary()
  },
  methods: {
    callForSummary() {
      this.isLoading = true
      AwarenessEducatorService.getTrainingReportSummary(this.id)
        .then((response) => {
          this.trainingSummary = response?.data?.data
          this.$store.dispatch('common/setActivePageRouterName', this.trainingSummary?.name || '')
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    callForFormDetails() {
      AwarenessEducatorService.getTrainingReportFormDetails().then((response) => {
        this.formDetails = response?.data?.data
      })
    }
  }
}
</script>
