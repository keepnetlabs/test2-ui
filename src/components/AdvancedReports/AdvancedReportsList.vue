<template>
  <div>
    <DatatableLoading v-if="isLoading" :loading="isLoading" />
    <div v-else>
      <AdvancedReportsCard
        v-for="(report, index) in reports"
        :class="getReportClass(index)"
        :key="report.name"
        :title="report.name"
        :description="report.description"
        :resource-id="report.resourceId"
        @on-action-button-click="handleActionButtonClick"
      />
    </div>
  </div>
</template>

<script>
import AdvancedReportsCard from '@/components/AdvancedReports/AdvancedReportsCard'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
export default {
  name: 'AdvancedReportsList',
  components: { DatatableLoading, AdvancedReportsCard },
  props: {
    reports: {
      type: Array
    },
    isLoading: {
      type: Boolean
    }
  },
  methods: {
    handleActionButtonClick(resourceId = '') {
      this.$router.push(`/reports/advanced-reports/advanced-report/${resourceId}`)
    },
    getReportClass(index) {
      return this.reports.length > 1 && index < this.reports.length - 1 ? 'mb-4' : ''
    }
  }
}
</script>
