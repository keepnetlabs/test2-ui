<template>
  <KContainer tabless>
    <DatatableLoading v-if="isLoading" :loading="isLoading" />
    <div :style="isLoading ? 'visibility:hidden;max-height:0px' : ''">
      <PowerBIReportEmbed
        v-if="renderReport"
        :key="renderKey"
        :embed-config="config"
        css-class-name="advanced-report-power-bi-container"
        :event-handlers="eventHandlers"
      />
    </div>
  </KContainer>
</template>

<script>
import KContainer from '@/components/KContainer/KContainer'
import ReportsService from '@/api/reports'
import { PowerBIReportEmbed } from 'powerbi-client-vue-js'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import { useLoading } from '@/hooks/useLoading'
import { createRandomCryptStringNumber } from '@/utils/functions'

export default {
  name: 'AdvancedReport',
  components: { DatatableLoading, KContainer, PowerBIReportEmbed },
  mixins: [useLoading],
  created() {
    this.callForData()
  },
  data() {
    return {
      renderReport: false,
      renderKey: `render-key-${createRandomCryptStringNumber()}`,
      config: {
        type: 'report',
        tokenType: 1,
        id: '',
        embedUrl: '',
        accessToken: '',
        settings: {
          panes: {
            filters: {
              visible: false
            },
            pageNavigation: {
              visible: false
            }
          }
        }
      },
      eventHandlers: new Map([
        [
          'loaded',
          () =>
            setTimeout(() => {
              this.setLoading()
            }, 1000)
        ]
      ])
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
          this.renderKey = `render-key-${createRandomCryptStringNumber()}`
          this.renderReport = true
        })
        .catch(this.setLoading)
    }
  }
}
</script>
