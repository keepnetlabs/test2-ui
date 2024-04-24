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
import { getVishingReportSummary, getVishingTemplateLanguages } from '@/api/vishing'
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
      languageItems: [],
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
        'Language / Voice': {
          show: true,
          value: `${vishingTemplateDto?.vishingLanguage} / ${vishingTemplateDto?.vishingVoice}`
        }
      }
    },
    isTestTraining() {
      const { isTestCampaign = false } = this.vishingSummary || {}
      return isTestCampaign
    },
    getVishingTemplateData() {
      if (!this.vishingSummary || !this.languageItems) return {}
      const { vishingTemplateDto = {}, campaignName = '' } = this.vishingSummary || {}
      const {
        name = '',
        description = '',
        difficulty = '',
        createTime = '',
        tags = [],
        steps = [],
        vishingLanguageResourceId = ''
      } = vishingTemplateDto || {
        name: '',
        description: '',
        difficulty: '',
        createTime: '',
        tags: [],
        steps: [],
        vishingLanguageResourceId: ''
      }
      this.$store.dispatch('common/setActivePageRouterName', campaignName)
      const langaugeIndex = this.languageItems.findIndex(
        (language) => language.resourceId === vishingLanguageResourceId
      )
      const splittedLanguage = vishingTemplateDto?.vishingLanguage?.split('-')
      const languageShortCode =
        (splittedLanguage && splittedLanguage[0] && splittedLanguage[0].trim()) || ''
      const narratorGender =
        (splittedLanguage && splittedLanguage[1] && splittedLanguage[1].trim()) || ''
      const invalidDialingNoticeStepIndex = steps.findIndex((step) => step.order === 0)
      let template = {
        resourceId: this.$route.params.id,
        name,
        language: vishingTemplateDto?.vishingLanguage,
        voice: this.languageItems[langaugeIndex].name,
        languageShortCode,
        narratorGender,
        description,
        difficulty,
        createdBy: '',
        createTime,
        tags,
        steps,
        vishingLanguageResourceId,
        voiceProviderTypeId: this.languageItems[langaugeIndex].voiceProviderTypeId
      }
      if (invalidDialingNoticeStepIndex !== -1) {
        template = {
          ...template,
          invalidDialingNotice: { ...steps[invalidDialingNoticeStepIndex] }
        }
        template.steps.splice(invalidDialingNoticeStepIndex, 1)
      }
      return { template }
    },
    getResendDialogItems() {
      const {
        answeredCount: answered = 0,
        noResponseCount: noResponse = 0,
        errorTargetUserCount = 0
      } = this.vishingSummary || {}
      return { answered, noResponse, callingError: errorTargetUserCount }
    }
  },
  created() {
    this.callForData()
    this.callForLanguages()
  },
  methods: {
    callForLanguages() {
      getVishingTemplateLanguages().then((response) => {
        this.languageItems = response?.data?.data || []
      })
    },
    callForData() {
      if (!this.id) return
      this.isLoading = true
      getVishingReportSummary(this.id)
        .then((res) => {
          const { data: { data = {} } = {} } = res || {}
          this.vishingSummary = data
        })
        .finally(() => {
          this.isLoading = false
        })
    }
  }
}
</script>
