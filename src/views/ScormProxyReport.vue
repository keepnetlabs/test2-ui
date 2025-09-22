<template>
  <KContainer id="training-report">
    <ElTabs v-model="tab">
      <template v-for="item in tabItems">
        <ElTabPane
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
            :isLoading="isLoading"
            :training-name="getTrainingName"
            :form-details="formDetails"
            :trainingSummary="trainingSummary"
            :scormTrainingSummary="scormTrainingSummary"
            :isScormProxy="isScormProxy"
            :isSurvey="isSurvey"
          />
        </ElTabPane>
      </template>
    </ElTabs>
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
      scormTrainingSummary: null,
      isLoading: false,
      isSurvey: false,
      tab: labels.Summary,
      tabItems: [
        {
          name: labels.Summary,
          id: 'training-report-summary-content',
          label: labels.Summary,
          component: TrainingReportSummary,
          isVisible: true
        },
        {
          name: labels.Users,
          id: 'training-report-users-content',
          label: labels.Users,
          component: TrainingReportUsers,
          isVisible: true
        },
        {
          name: labels.OpenedTrainingEmail,
          id: 'training-report-opened-content',
          label: labels.OpenedTrainingEmail,
          component: TrainingReportOpenedTrainingEmail,
          isVisible: true
        },
        {
          name: labels.ClickedTrainingLink,
          id: 'training-report-clicked-content',
          label: labels.ClickedTrainingLink,
          component: TrainingReportClickedTrainingLink,
          isVisible: true
        },
        {
          name: labels.Progress,
          id: 'training-report-progress-content',
          label: labels.Progress,
          component: TrainingReportProgress,
          isVisible: true
        },
        {
          name: labels.ExamResults,
          id: 'training-report-exam-results-content',
          label: labels.ExamResults,
          component: TrainingReportExamResults,
          isVisible: true
        },
        {
          name: labels.NoResponse,
          id: 'training-report-no-response-content',
          label: labels.NoResponse,
          component: TrainingReportNoResponse,
          isVisible: true
        },
        {
          name: labels.SendingReport,
          id: 'training-report-sending-report-content',
          label: labels.SendingReport,
          component: TrainingReportSendingReport,
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
          this.isSurvey = this.trainingSummary?.trainingDetails?.hasQuiz
          if (this.isSurvey) {
            this.tabItems[2].label = labels.OpenededSurvey
            this.tabItems[3].label = labels.ClickedSurveyLink
            this.tabItems.splice(5, 1)
          }
          this.$store.dispatch('common/setActivePageRouterName', this.trainingSummary?.name || '')
        })
        .finally(() => {
          this.isLoading = false
        })
      AwarenessEducatorService.getScormProxyTrainingReportSummary(this.id).then((response) => {
        this.scormTrainingSummary = response?.data?.data
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
