<template>
  <KContainer id="vishing-report">
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
          :training-name="getVishingNamae"
        />
      </el-tab-pane>
    </el-tabs>
  </KContainer>
</template>

<script>
import KContainer from '@/components/KContainer/KContainer'
import labels from '@/model/constants/labels'
import VishingReportSummary from '@/components/VishingReport/VishingReportSummary'
export default {
  name: 'VishingReport',
  components: { KContainer },
  data() {
    return {
      isLoading: false,
      tab: labels.Summary,
      tabItems: [
        {
          name: labels.Summary,
          id: 'training-report-summary-content',
          label: labels.Summary,
          component: VishingReportSummary,
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
          isVisible: this.$store.getters[
            'permissions/getCampaignReportsPhishingReporterPermissions'
          ]
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
      ]
    }
  },
  computed: {
    id() {
      return this.$route?.params?.id
    },
    getVishingNamae() {
      return this.$store?.state?.common?.activePageRouterName || 'Vishing Name'
    }
  }
}
</script>
