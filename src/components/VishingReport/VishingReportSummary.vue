<template>
  <div id="vishing-report-summary" class="training-report-summary">
    <VishingReportSummaryHeader
      :vishing-name="vishingName"
      :id="id"
      :vishing-report-items="getResendDialogItems"
    />
    <VishingReportSummaryCards :items="getCardsData" />
    <div class="campaign-manager-report-summary__general-info mt-6">
      <VishingReportCampaignInfo :items="getVishingInfoData" :is-test-training="isTestTraining" />
      <VishingReportDelivery class="ml-4" :items="getTrainingVishingDeliveryData" />
    </div>
  </div>
</template>

<script>
import VishingReportSummaryHeader from '@/components/VishingReport/VishingReportSummaryHeader'
import VishingReportSummaryCards from '@/components/VishingReport/VishingReportSummaryCards'
import VishingReportCampaignInfo from '@/components/VishingReport/VishingReportCampaignInfo'
import VishingReportDelivery from '@/components/VishingReport/VishingReportDelivery'
export default {
  name: 'VishingReportSummary',
  components: {
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
    },
    trainingSummary: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  computed: {
    getCardsData() {
      const { reportDetail = {}, completedCount = 0 } = this.trainingSummary || {}
      const {
        totalTargetUserCount = 0,
        totalUserClickedCount = 0,
        totalUserOpenedCount = 0,
        noResponseCount = 0,
        inProgressCount = 0
      } = reportDetail
      const inProgress = inProgressCount ? inProgressCount : totalUserClickedCount - completedCount
      return {
        openedEmail: {
          userCount: totalUserOpenedCount,
          userPercent:
            totalTargetUserCount === 0
              ? '0'
              : ((totalUserOpenedCount / totalTargetUserCount) * 100).toFixed()
        },
        inProgress: {
          userCount: inProgress,
          userPercent:
            totalTargetUserCount === 0 ? '0' : ((inProgress / totalTargetUserCount) * 100).toFixed()
        },
        completedTraining: {
          userCount: completedCount,
          userPercent:
            totalTargetUserCount === 0
              ? '0'
              : ((completedCount / totalTargetUserCount) * 100).toFixed()
        },
        noResponse: {
          userCount: noResponseCount,
          userPercent:
            totalTargetUserCount === 0
              ? '0'
              : ((noResponseCount / totalTargetUserCount) * 100).toFixed()
        }
      }
    },
    getTrainingVishingDeliveryData() {
      const {
        phoneNumber = '+44 545 678 95 53',
        startDate = '28.05.2021 16:29:00 - 29.05.2021 16:29:90'
      } = this.trainingSummary || {}
      return {
        'Campaign Start-End Date': startDate,
        'Caller Phone Number': phoneNumber,
        'Calling Status': 15
      }
    },
    getVishingInfoData() {
      const { totalTargetUserCount = 15 } = this?.trainingSummary?.reportDetail || {}
      return {
        'Target Users': {
          show: true,
          value: totalTargetUserCount
        },
        Language: {
          show: true,
          value: 'EN/Female'
        }
      }
    },
    isTestTraining() {
      const { isTest = false } = this.trainingSummary || {}
      return isTest
    }
  },
  methods: {
    getResendDialogItems() {
      return { answered: 21, noResponse: 36 }
    }
  }
}
</script>
