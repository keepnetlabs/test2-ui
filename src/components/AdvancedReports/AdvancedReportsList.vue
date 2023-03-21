<template>
  <div>
    <DatatableLoading v-if="isLoading" :loading="isLoading" />
    <AdvancedReportsCard v-else />
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
  methods: {
    callForData() {
      this.setLoading(true)
      ReportsService.getReports().then((response) => {})
    }
  }
}
</script>
