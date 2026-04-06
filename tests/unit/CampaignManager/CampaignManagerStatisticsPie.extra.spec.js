import CampaignManagerStatisticsPie from '@/components/CampaignManager/CampaignManagerStatistics/CampaignManagerStatisticsPie.vue'

const fullWidgetPayload = () => [
  {
    widgetDatas: [
      { dataObject: { ActionRange: 'Undetected' }, values: [{ value: 10 }, { value: 100 }] },
      { dataObject: { ActionRange: 'Malicious' }, values: [{ value: 20 }, { value: 200 }] },
      { dataObject: { ActionRange: 'Phishing' }, values: [{ value: 30 }, { value: 300 }] },
      { dataObject: { ActionRange: 'Simulation' }, values: [{ value: 40 }, { value: 400 }] }
    ]
  }
]

describe('CampaignManagerStatisticsPie.vue (extra branching)', () => {
  const baseCtx = () => ({
    isEmpty: true,
    isLoading: true,
    valueEnums: ['Undetected', 'Malicious', 'Phishing', 'Simulation'],
    chartData: [],
    chartOptions: {}
  })

  describe('setChartData plugins.datalabels.formatter', () => {
    let formatter

    beforeEach(() => {
      const ctx = baseCtx()
      CampaignManagerStatisticsPie.methods.setChartData.call(ctx, fullWidgetPayload())
      formatter = ctx.chartOptions.plugins.datalabels.formatter
    })

    it('returns empty string for zero', () => {
      expect(formatter(0)).toBe('')
    })

    it('returns value with percent suffix for non-zero', () => {
      expect(formatter(42)).toBe('42%')
    })
  })

  describe('setChartData legend generateLabels', () => {
    let generateLabels

    beforeEach(() => {
      const ctx = baseCtx()
      CampaignManagerStatisticsPie.methods.setChartData.call(ctx, fullWidgetPayload())
      generateLabels = ctx.chartOptions.legend.labels.generateLabels
    })

    it('sets customMarginLeft 5 for Undetected, 3 for Simulation, 1 for others', () => {
      const chart = {
        data: {
          labels: ['Undetected', 'Malicious', 'Phishing', 'Simulation'],
          datasets: [{ data: [10, 20, 30, 40] }]
        }
      }
      const items = generateLabels(chart)
      expect(items[0].customMarginLeft).toBe(5)
      expect(items[1].customMarginLeft).toBe(1)
      expect(items[2].customMarginLeft).toBe(1)
      expect(items[3].customMarginLeft).toBe(3)
    })

    it('uses single-token textParts when label has one word', () => {
      const chart = {
        data: {
          labels: ['Malicious'],
          datasets: [{ data: [20] }]
        }
      }
      const [item] = generateLabels(chart)
      expect(item.textParts).toEqual(['Malicious', 20])
    })

    it('joins first two words when label has multiple tokens', () => {
      const chart = {
        data: {
          labels: ['AI Ally Generated'],
          datasets: [{ data: [15] }]
        }
      }
      const [item] = generateLabels(chart)
      expect(item.textParts[0]).toBe('AI Ally')
      expect(item.textParts[1]).toBe(15)
    })
  })
})
