<template>
  <div>
    <DatatableLoading v-if="isLoading" :loading="isLoading" />
    <AdvancedReportsCard
      v-else
      v-for="report in reports"
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
import ReportsService from '@/api/reports'
import { useLoading } from '@/hooks/useLoading'

export default {
  name: 'AdvancedReportsList',
  components: { DatatableLoading, AdvancedReportsCard },
  mixins: [useLoading],
  data() {
    return {
      reports: []
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      this.setLoading(true)
      ReportsService.getReports()
        .then((response) => {
          const { data: { data = [] } = {} } = response || {}
          this.reports = data
        })
        .finally(this.setLoading)
    },
    handleActionButtonClick(resourceId = '') {
      this.$router.push(`/reports/advanced-reports/advanced-report/${resourceId}`)
    }
  }
}
</script>
