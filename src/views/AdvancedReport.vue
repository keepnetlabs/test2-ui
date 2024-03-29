<template>
  <KContainer tabless>
    <DatatableLoading v-if="isLoading" :loading="isLoading" />
    <div :style="isLoading ? 'visibility:hidden;max-height:0px' : ''">
      <div class="advanced-report-power-bi-container" ref="reportContainer"></div>
    </div>
  </KContainer>
</template>

<script>
import KContainer from '@/components/KContainer/KContainer'
import ReportsService from '@/api/reports'
import * as pbi from 'powerbi-client'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import { useLoading } from '@/hooks/useLoading'
export default {
  name: 'AdvancedReport',
  components: { DatatableLoading, KContainer },
  mixins: [useLoading],
  data() {
    return {
      report: null
    }
  },
  mounted() {
    this.callForData()
  },
  methods: {
    callForData() {
      const { params = {} } = this.$route || {}
      this.setLoading(true)
      ReportsService.getReportDetail(params.id).then((response) => {
        const { data: { data = {} } = {} } = response || {}
        const { embedReport = {}, embedToken = {} } = data
        const config = {
          type: 'report',
          tokenType: pbi.models.TokenType.Embed,
          accessToken: embedToken.token,
          embedUrl: embedReport.embedUrl,
          permissions: pbi.models.Permissions.All,
          settings: {
            filterPaneEnabled: false,
            navContentPaneEnabled: false
          }
        }
        this.report = window.powerbi.embed(this.$refs.reportContainer, config)
        this.report.on('loaded', () => {
          this.setLoading()
        })
      })
    }
  }
}
</script>
