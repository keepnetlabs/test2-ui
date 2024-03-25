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
import TrainingReportClickedTrainingLink from '@/components/AwarenessEducator/TrainingReport/ClickedTrainingLink/TrainingReportClickedTrainingLink'
import TrainingReportExamResults from '@/components/AwarenessEducator/TrainingReport/ExamResults/TrainingReportExamResults'
import TrainingReportNoResponse from '@/components/AwarenessEducator/TrainingReport/NoResponse/TrainingReportNoResponse'
import TrainingReportOpenedTrainingEmail from '@/components/AwarenessEducator/TrainingReport/OpenedTrainingEmail/TrainingReportOpenedTrainingEmail'
import TrainingReportProgress from '@/components/AwarenessEducator/TrainingReport/Progress/TrainingReportProgress'
import TrainingReportSummary from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSummary'
import TrainingReportUsers from '@/components/AwarenessEducator/TrainingReport/Users/TrainingReportUsers'
import TrainingReportSendingReport from '@/components/AwarenessEducator/TrainingReport/SendingReport/TrainingReportSendingReport'
import KContainer from '@/components/KContainer/KContainer'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { mapActions } from 'vuex'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

export default {
  name: 'TrainingReport',
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
    this.callForLanguages()
  },
  methods: {
    ...mapActions({
      callForLanguages: 'trainingLibraryHelpers/callForLanguages'
    }),
    callForSummary() {
      this.isLoading = true
      AwarenessEducatorService.getTrainingReportSummary(this.id)
        .then((response) => {
          this.trainingSummary = response?.data?.data
          if (this.trainingSummary.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER) {
            this.tabItems[2].name = labels.OpenedPosterEmail
            this.tabItems[2].label = labels.OpenedPosterEmail
            this.tabItems[3].name = labels.DownloadedPoster
            this.tabItems[3].label = labels.DownloadedPoster
            this.tabItems.splice(4, 2)
          } else if (
            this.trainingSummary.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC
          ) {
            this.tabItems[2].name = labels.OpenedInfographicEmail
            this.tabItems[2].label = labels.OpenedInfographicEmail
            this.tabItems[3].name = labels.DownloadedInfographic
            this.tabItems[3].label = labels.DownloadedInfographic
            this.tabItems.splice(4, 2)
          } else if (
            this.trainingSummary.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH
          ) {
            this.tabItems[0].name = labels.LearningPathSummary
            this.tabItems[0].label = labels.LearningPathSummary
          }
          this.$store.dispatch('common/setActivePageRouterName', this.trainingSummary?.name || '')
          this.$store.dispatch(
            'common/setActiveTrainingType',
            this.trainingSummary?.trainingTypeName
          )
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
