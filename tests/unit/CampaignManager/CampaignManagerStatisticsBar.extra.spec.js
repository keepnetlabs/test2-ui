import CampaignManagerStatisticsBar from '@/components/CampaignManager/CampaignManagerStatistics/CampaignManagerStatisticsBar.vue'

describe('CampaignManagerStatisticsBar.vue (extra branching)', () => {
  const sampleWidgetData = (scores) =>
    scores.map((value, i) => ({
      dataObject: { Company: `C${i}` },
      values: [{ value }, { value: 100 }]
    }))

  const mountCtx = () => ({
    isEmpty: false,
    isLoading: false,
    chartData: {},
    chartOptions: {}
  })

  describe('setChartData dataset backgroundColor', () => {
    it('uses dark blue only when value is strictly greater than 60', () => {
      const ctx = mountCtx()
      CampaignManagerStatisticsBar.methods.setChartData.call(ctx, [
        { widgetDatas: sampleWidgetData([61, 60]) }
      ])
      const fn = ctx.chartData.datasets[0].backgroundColor
      expect(
        fn({ dataIndex: 0, dataset: { data: [{ x: 61 }, { x: 60 }] } })
      ).toBe('#1173C1')
      expect(
        fn({ dataIndex: 1, dataset: { data: [{ x: 61 }, { x: 60 }] } })
      ).toBe('rgba(17, 115, 193, 0.55)')
    })
  })

  describe('setChartData datalabels formatter', () => {
    let formatter

    beforeEach(() => {
      const ctx = mountCtx()
      CampaignManagerStatisticsBar.methods.setChartData.call(ctx, [
        { widgetDatas: sampleWidgetData([50, 50]) }
      ])
      formatter = ctx.chartOptions.plugins.datalabels.formatter
    })

    it('returns empty string when x is 0 (falsy)', () => {
      expect(formatter({ x: 0 })).toBe('')
    })

    it('returns empty string when x is missing', () => {
      expect(formatter({})).toBe('')
    })

    it('appends percent for positive x', () => {
      expect(formatter({ x: 33 })).toBe('33%')
    })
  })
})
