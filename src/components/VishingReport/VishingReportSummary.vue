<template>
  <div id="vishing-report-summary" class="training-report-summary">
    <VishingReportSummaryHeader
      :vishing-name="vishingName"
      :id="id"
      :vishing-report-items="getResendDialogItems"
    />
    <VishingReportSummaryCards :items="getCardsData" :is-loading="isLoading" />
    <div class="campaign-manager-report-summary__general-info mt-6">
      <VishingReportCampaignInfo
        class="vishing-report-campaign-info"
        :is-loading="isLoading"
        :items="getVishingInfoData"
        :is-test-training="isTestTraining"
      />
      <VishingReportDelivery
        class="ml-4"
        :is-loading="isLoading"
        :items="getVishingDeliveryData"
        :helper-data="getVishingDeliveryHelperData"
      />
    </div>
    <DatatableLoading v-if="isLoading" :loading="isLoading" />
    <VishingReportTemplate v-else :form-data="getVishingTemplateData" />
  </div>
</template>

<script>
import VishingReportSummaryHeader from '@/components/VishingReport/VishingReportSummaryHeader'
import VishingReportSummaryCards from '@/components/VishingReport/VishingReportSummaryCards'
import VishingReportCampaignInfo from '@/components/VishingReport/VishingReportCampaignInfo'
import VishingReportDelivery from '@/components/VishingReport/VishingReportDelivery'
import VishingReportTemplate from '@/components/VishingReport/VishingReportTemplate'
import { getVishingReportSummary } from '@/api/vishing'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading.vue'
export default {
  name: 'VishingReportSummary',
  components: {
    DatatableLoading,
    VishingReportTemplate,
    VishingReportDelivery,
    VishingReportCampaignInfo,
    VishingReportSummaryCards,
    VishingReportSummaryHeader
  },
  props: {
    id: {
      type: String
    },
    vishingName: {
      type: String
    }
  },
  data() {
    return {
      vishingSummary: {},
      isLoading: false
    }
  },
  computed: {
    getCardsData() {
      const {
        answeredCount = 0,
        answeredPercent = 0,
        vishedCount = 0,
        vishedPercent = 0,
        noResponseCount = 0,
        noResponsePercent = 0
      } = this.vishingSummary || {}
      return {
        answered: {
          userCount: answeredCount,
          userPercent: answeredPercent.toString()
        },
        vished: {
          userCount: vishedCount,
          userPercent: vishedPercent.toString()
        },
        noResponse: {
          userCount: noResponseCount,
          userPercent: noResponsePercent.toString()
        }
      }
    },
    getVishingDeliveryData() {
      const { callerPhoneNumber = '', startTime = '', endTime } = this.vishingSummary || {}
      return {
        'Delivery Start-End Date': `${startTime || ''}-${endTime || 'In Progress'}`,
        'Caller Phone Number': callerPhoneNumber,
        'Calling Status': ''
      }
    },
    getVishingDeliveryHelperData() {
      const { errorTargetUserCount = 0, errorlessTargetUserCount = 0, targetUserCount = 0 } =
        this.vishingSummary || {}
      return {
        totalTargetUserCount: targetUserCount,
        emailErrorUserCount: errorTargetUserCount,
        emailDeliveredUserCount: errorlessTargetUserCount
      }
    },
    getVishingInfoData() {
      const { targetUserCount = 0, vishingTemplateDto = {} } = this.vishingSummary || {}
      return {
        'Target Users': {
          show: true,
          value: targetUserCount
        },
        Language: {
          show: true,
          value: vishingTemplateDto?.vishingLanguage
        }
      }
    },
    isTestTraining() {
      const { isTestCampaign = false } = this.vishingSummary || {}
      return isTestCampaign
    },
    getVishingTemplateData() {
      const { vishingTemplateDto = {} } = this.vishingSummary || {}
      const {
        name = '',
        description = '',
        difficulty = '',
        createTime = '',
        tags = [],
        steps = []
      } = vishingTemplateDto
      //  isOwner: true,availableFor :true
      this.$store.dispatch('common/setActivePageRouterName', name)
      const splittedLanguage = vishingTemplateDto?.vishingLanguage?.split('-')
      const languageShortCode = splittedLanguage[0].trim()
      const narratorGender = splittedLanguage[1].trim()
      const invalidDialingNoticeStepIndex = steps.findIndex((step) => step.order === 0)
      if (invalidDialingNoticeStepIndex !== -1) {
        steps.splice(invalidDialingNoticeStepIndex, 1)
      }
      return {
        template: {
          resourceId: this.$route.params.id,
          name,
          language: vishingTemplateDto?.vishingLanguage,
          languageShortCode,
          narratorGender,
          description,
          difficulty,
          createdBy: '',
          createTime,
          tags,
          steps
        }
      }
    },
    getResendDialogItems() {
      return {}
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      if (!this.id) return
      this.isLoading = true
      getVishingReportSummary(this.id)
        .then((res) => {
          const { data: { data = {} } = {} } = res || {}
          this.vishingSummary = data
          console.log('this.vishingSummary', this.vishingSummary)
        })
        .finally(() => {
          this.isLoading = false
        })
    }
  }
}
</script>
