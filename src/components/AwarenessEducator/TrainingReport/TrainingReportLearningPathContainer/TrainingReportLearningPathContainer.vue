<template>
  <ElTabs
    v-model="tab"
    :class="[
      'k-sub-tab training-library-first-card-sub-tabs',
      isLoading ? 'training-library-first-card-sub-tabs--loading' : ''
    ]"
    @tab-click="handleTabClick"
  >
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
        <v-skeleton-loader v-if="isLoading" :loading="isLoading" type="chip" />
        <template v-else> {{ item.label }} </template>
      </span>
      <component
        v-if="item.name === tab"
        :is="item.component"
        :id="id"
        :custom-fields="customFields"
        :isLoading="isLoading"
        :training-name="getTrainingName"
        :form-details="formDetails"
        :trainingSummary="selectedTrainingSummary"
        :isScormProxy="isScormProxy"
        isLearningPath
      />
    </ElTabPane>
  </ElTabs>
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
import {
  TRAINING_LIBRARY_PAYLOAD_TYPES,
  TRAINING_LIBRARY_TYPES
} from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

export default {
  name: 'TrainingReportLearningPathContainer',
  components: { KContainer },
  props: {
    trainingSummary: {
      type: Object,
      default: () => ({})
    },
    activeStep: {
      type: Number,
      default: 0
    },
    formDetails: {
      type: Object,
      default: () => ({})
    },
    customFields: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedTrainingSummary: null,
      isLoading: false,
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
      ]
    }
  },
  computed: {
    id() {
      return this.activeTrainingStep?.enrollmentId
    },
    activeTrainingStep() {
      return this.trainingSummary?.steps[this.activeStep]
    },
    activeTrainingStepType() {
      return this.activeTrainingStep?.trainingDetails?.trainingTypeName
    },
    getTrainingName() {
      return this.$store?.state?.common?.activePageRouterName || 'Training Name'
    },
    isScormProxy() {
      return this.selectedTrainingSummary?.isScormProxy || false
    }
  },
  created() {
    this.callForSummary()
  },
  methods: {
    callForSummary() {
      this.isLoading = true
      let type = 0
      if (this.activeTrainingStepType === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER) type = 1
      else if (this.activeTrainingStepType === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC) type = 2
      else if (this.activeTrainingStepType === TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER) type = 3
      else if (
        this.activeTrainingStepType === TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH ||
        this.activeTrainingStepType === TRAINING_LIBRARY_TYPES.LEARNING_PATH
      )
        type = 4
      AwarenessEducatorService.getTrainingReportSummary(this.id, type)
        .then((response) => {
          const {
            data: { data }
          } = response || {}
          data.trainingTypeName = this.activeTrainingStepType
          this.selectedTrainingSummary = data
          if (
            this.selectedTrainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER
          ) {
            this.tabItems[2].label = labels.OpenedPosterEmail
            this.tabItems[3].label = labels.DownloadedPoster
            this.tabItems.splice(4, 2)
          } else if (
            this.selectedTrainingSummary?.trainingTypeName ===
            TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC
          ) {
            this.tabItems[2].label = labels.OpenedInfographicEmail
            this.tabItems[3].label = labels.DownloadedInfographic
            this.tabItems.splice(4, 2)
          }
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    handleTabClick(tab) {
      if (tab.name === labels.Summary) {
        AwarenessEducatorService.getTrainingReportSummary(
          this.id,
          this.$route?.query?.trainingType || 0
        ).then((response) => {
          this.trainingSummary = response?.data?.data
        })
      }
    }
  }
}
</script>
