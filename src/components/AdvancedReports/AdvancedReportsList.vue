<template>
  <div>
    <DatatableLoading v-if="isLoading" :loading="isLoading" />
    <AdvancedReportsCard
      v-else
      v-for="(report, index) in reports"
      :class="reports.length > 1 && index < reports.length - 1 ? 'mb-4' : ''"
      :key="report.name"
      :title="report.name"
      :description="report.description"
      :resource-id="report.resourceId"
      @on-action-button-click="handleActionButtonClick"
    />
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
    }
  }
}
</script>
