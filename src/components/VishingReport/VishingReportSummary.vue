<template>
  <div id="vishing-report-summary" class="training-report-summary">
    <VishingReportSummaryHeader
      :vishing-name="vishingName"
      :id="id"
      :vishing-report-items="getResendDialogItems"
    />
    <VishingReportSummaryCards :items="getCardsData" />
  </div>
</template>

<script>
import VishingReportSummaryHeader from '@/components/VishingReport/VishingReportSummaryHeader'
import VishingReportSummaryCards from '@/components/VishingReport/VishingReportSummaryCards'
export default {
  name: 'VishingReportSummary',
  components: { VishingReportSummaryCards, VishingReportSummaryHeader },
  props: {
    id: {
      type: String
    },
    vishingName: {
      type: String
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
    }
  },
  methods: {
    getResendDialogItems() {
      return { answered: 21, noResponse: 36 }
    }
  }
}
</script>
