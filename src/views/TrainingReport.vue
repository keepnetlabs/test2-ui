<template>
  <KContainer id="training-report">
    <ElTabs v-model="tab" @tab-click="handleTabClick">
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
            :custom-fields="customFields"
            :isLoading="isLoading"
            :training-name="getTrainingName"
            :form-details="formDetails"
            :trainingSummary="trainingSummary"
            :isScormProxy="isScormProxy"
            :active-step="item.activeStep"
            :isSurvey="isSurvey"
            :award-certificate-enrollment-id="awardCertificateEnrollmentId"
          />
        </ElTabPane>
      </template>
    </ElTabs>
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
import TrainingReportLearningPathContainer from '../components/AwarenessEducator/TrainingReport/TrainingReportLearningPathContainer/TrainingReportLearningPathContainer.vue'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'
import { getTargetUserCustomFieldsByCompanyId } from '@/api/targetUsers'
export default {
  name: 'TrainingReport',
  components: { KContainer },
  data() {
    return {
      customFields: [],
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
      formDetails: null,
      awardCertificateEnrollmentId: null
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
    },
    isSurvey() {
      return this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.SURVEY || true
    }
  },
  created() {
    this.callForCustomFields()
    this.callForFormDetails()
    this.callForSummary()
    this.callForLanguages()
  },
  methods: {
    ...mapActions({
      callForLanguages: 'trainingLibraryHelpers/callForLanguages'
    }),
    callForCustomFields() {
      getTargetUserCustomFieldsByCompanyId().then((response) => {
        this.customFields = response?.data?.data
      })
    },
    callForSummary() {
      this.isLoading = true
      AwarenessEducatorService.getTrainingReportSummary(
        this.id,
        this.$route?.query?.trainingType || 0
      ).then((response) => {
        this.trainingSummary = response?.data?.data
        if (this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.SURVEY || true) {
          this.tabItems[2].label = labels.OpenededSurvey
          this.tabItems[3].label = labels.ClickedSurveyLink
          this.tabItems.splice(5, 1)
        } else if (
          this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER
        ) {
          this.tabItems[2].label = labels.OpenedPosterEmail
          this.tabItems[3].label = labels.DownloadedPoster
          this.tabItems.splice(4, 2)
        } else if (
          this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC
        ) {
          this.tabItems[2].label = labels.OpenedInfographicEmail
          this.tabItems[3].label = labels.DownloadedInfographic
          this.tabItems.splice(4, 2)
        } else if (
          this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH ||
          this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_TYPES.LEARNING_PATH
        ) {
          const newTabItems = []
          newTabItems.push({
            name: labels.Summary,
            id: 'training-report-summary-content',
            label: labels.LearningPathSummary,
            component: TrainingReportSummary,
            isVisible: true
          })
          const awardCertificateIndex = this.trainingSummary.steps.findIndex(
            (step) => step.awardCertificate
          )
          if (awardCertificateIndex !== -1) {
            this.awardCertificateEnrollmentId = this.trainingSummary.steps[
              awardCertificateIndex
            ].enrollmentId
          }
          this.trainingSummary.steps.sort((a, b) => a.stepNumber - b.stepNumber)
          this.trainingSummary.steps.forEach((step, index) => {
            newTabItems.push({
              name: `${index + 1}`,
              id: `training-report-learning-path-${step.trainingName}-${index}`,
              label: `Step ${index + 1}: ${step.trainingName}`,
              component: TrainingReportLearningPathContainer,
              activeStep: index,
              isVisible: true
            })
          })
          this.tabItems = newTabItems
        }
        this.$store.dispatch('common/setActivePageRouterName', this.trainingSummary?.name || '')
        this.$store.dispatch('common/setActiveTrainingType', this.trainingSummary?.trainingTypeName)
        this.isLoading = false
      })
    },
    callForFormDetails() {
      AwarenessEducatorService.getTrainingReportFormDetails().then((response) => {
        this.formDetails = response?.data?.data
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
