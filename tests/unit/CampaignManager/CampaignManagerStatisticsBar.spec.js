import CampaignManagerStatisticsBar from '@/components/CampaignManager/CampaignManagerStatistics/CampaignManagerStatisticsBar.vue'
import { getExecutiveReportChartData } from '@/api/reports'

jest.mock('@/api/reports', () => ({
  getExecutiveReportChartData: jest.fn(() =>
    Promise.resolve({
      data: {
        data: [
          {
            widgetDatas: [
              {
                dataObject: { Company: 'Acme' },
                values: [{ value: 70 }, { value: 120 }]
              },
              {
                dataObject: { Company: 'Contoso' },
                values: [{ value: 45 }, { value: 80 }]
              }
            ]
          }
        ]
      }
    })
  )
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerStatisticsBar.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('callForData requests data, emits default data and clears loading', async () => {
    const setChartData = jest.fn()
    const emit = jest.fn()
    const ctx = {
      isLoading: false,
      card: { resourceId: 'w-1', key: 'StatisticsRegionWidget' },
      $emit: emit,
      setChartData
    }

    CampaignManagerStatisticsBar.methods.callForData.call(ctx)
    expect(ctx.isLoading).toBe(true)
    await flushPromises()

    expect(getExecutiveReportChartData).toHaveBeenCalledWith(
      expect.objectContaining({
        widgetIds: ['w-1']
      })
    )
    expect(emit).toHaveBeenCalledWith(
      'on-set-default-widget-data',
      'StatisticsRegionWidget',
      expect.any(Array)
    )
    expect(setChartData).toHaveBeenCalled()
    expect(ctx.isLoading).toBe(false)
  })

  it('setChartData marks widget as empty when widgetDatas has no rows', () => {
    const ctx = {
      isEmpty: false,
      isLoading: true,
      chartData: {},
      chartOptions: {}
    }

    CampaignManagerStatisticsBar.methods.setChartData.call(ctx, [{ widgetDatas: [] }])

    expect(ctx.isEmpty).toBe(true)
  })

  it('setChartData maps companies/datasets and resets empty/loading flags', () => {
    const ctx = {
      isEmpty: true,
      isLoading: true,
      chartData: {},
      chartOptions: {}
    }
    const data = [
      {
        widgetDatas: [
          {
            dataObject: { Company: 'Acme' },
            values: [{ value: 70 }, { value: 120 }]
          },
          {
            dataObject: { Company: 'Contoso' },
            values: [{ value: 45 }, { value: 80 }]
          }
        ]
      }
    ]

    CampaignManagerStatisticsBar.methods.setChartData.call(ctx, data)

    expect(ctx.chartData.yLabels).toEqual(['Acme', 'Contoso'])
    expect(ctx.chartData.datasets[0].data[0]).toEqual(
      expect.objectContaining({
        x: 70,
        y: 'Acme'
      })
    )
    expect(ctx.isEmpty).toBe(false)
    expect(ctx.isLoading).toBe(false)
  })

  it('setChartData backgroundColor callback returns dark/light colors by score', () => {
    const ctx = {
      isEmpty: false,
      isLoading: false,
      chartData: {},
      chartOptions: {}
    }
    const data = [
      {
        widgetDatas: [
          {
            dataObject: { Company: 'Acme' },
            values: [{ value: 70 }, { value: 120 }]
          },
          {
            dataObject: { Company: 'Contoso' },
            values: [{ value: 45 }, { value: 80 }]
          }
        ]
      }
    ]

    CampaignManagerStatisticsBar.methods.setChartData.call(ctx, data)
    const fn = ctx.chartData.datasets[0].backgroundColor
    const dark = fn({
      dataIndex: 0,
      dataset: { data: [{ x: 70 }, { x: 45 }] }
    })
    const light = fn({
      dataIndex: 1,
      dataset: { data: [{ x: 70 }, { x: 45 }] }
    })

    expect(dark).toBe('#1173C1')
    expect(light).toBe('rgba(17, 115, 193, 0.55)')
  })
})
