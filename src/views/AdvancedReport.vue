<template>
  <KContainer tabless>
    <DatatableLoading v-if="isLoading" :loading="isLoading" />
    <PowerBIReportEmbed
      v-else
      :embed-config="config"
      css-class-name="advanced-report-power-bi-container"
    />
  </KContainer>
</template>

<script>
import KContainer from '@/components/KContainer/KContainer'
import ReportsService from '@/api/reports'
import { PowerBIReportEmbed } from 'powerbi-client-vue-js'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading.vue'
import { useLoading } from '@/hooks/useLoading'

export default {
  name: 'AdvancedReport',
  components: { DatatableLoading, KContainer, PowerBIReportEmbed },
  mixins: [useLoading],
  created() {
    this.callForData()
  },
  data() {
    return {
      config: { type: 'report', tokenType: 1, id: '', embedUrl: '', accessToken: '' }
    }
  },
  methods: {
    callForData() {
      const { params = {} } = this.$route || {}
      this.setLoading(true)
      ReportsService.getReportDetail(params.id)
        .then((response) => {
          const { data: { data = {} } = {} } = response || {}
          const { embedReport = {}, embedToken = {} } = data
          this.config.embedUrl = embedReport.embedUrl
          this.config.id = embedReport.reportId
          this.config.accessToken = embedToken.token
        })
        .finally(this.setLoading)
    }
  }
}
</script>
