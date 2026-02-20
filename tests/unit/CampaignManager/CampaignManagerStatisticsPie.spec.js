import CampaignManagerStatisticsPie from '@/components/CampaignManager/CampaignManagerStatistics/CampaignManagerStatisticsPie.vue'
import { getExecutiveReportChartData } from '@/api/reports'

jest.mock('@/api/reports', () => ({
  getExecutiveReportChartData: jest.fn(() =>
    Promise.resolve({
      data: {
        data: [
          {
            widgetDatas: [
              { dataObject: { ActionRange: 'Undetected' }, values: [{ value: 10 }, { value: 100 }] },
              { dataObject: { ActionRange: 'Malicious' }, values: [{ value: 20 }, { value: 200 }] },
              { dataObject: { ActionRange: 'Phishing' }, values: [{ value: 30 }, { value: 300 }] },
              { dataObject: { ActionRange: 'Simulation' }, values: [{ value: 40 }, { value: 400 }] }
            ]
          }
        ]
      }
    })
  )
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerStatisticsPie.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('watch dateRange triggers callForData', () => {
    const ctx = { callForData: jest.fn() }
    CampaignManagerStatisticsPie.watch.dateRange.call(ctx)
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('callForData requests widget data, emits update and clears loading', async () => {
    const emit = jest.fn()
    const setChartData = jest.fn()
    const ctx = {
      isLoading: false,
      card: { resourceId: 'wid-1', key: 'StatisticsAttackTypeWidget' },
      datePeriod: 1,
      dateRange: ['2024-01-01', '2024-01-31'],
      $emit: emit,
      setChartData
    }

    CampaignManagerStatisticsPie.methods.callForData.call(ctx)
    expect(ctx.isLoading).toBe(true)
    await flushPromises()

    expect(getExecutiveReportChartData).toHaveBeenCalledWith(
      expect.objectContaining({
        widgetIds: ['wid-1'],
        datePeriod: 1,
        startDate: '2024-01-01',
        endDate: '2024-01-31'
      })
    )
    expect(emit).toHaveBeenCalledWith(
      'on-set-default-widget-data',
      'StatisticsAttackTypeWidget',
      expect.any(Array)
    )
    expect(setChartData).toHaveBeenCalled()
    expect(ctx.isLoading).toBe(false)
  })

  it('setChartData sets empty state when widget data list is empty', () => {
    const ctx = {
      isEmpty: false,
      isLoading: true,
      chartData: [],
      chartOptions: {}
    }

    CampaignManagerStatisticsPie.methods.setChartData.call(ctx, [{ widgetDatas: [] }])

    expect(ctx.isEmpty).toBe(true)
  })

  it('setChartData maps percentages in expected order and sets chart options', () => {
    const ctx = {
      isEmpty: true,
      isLoading: true,
      valueEnums: ['Undetected', 'Malicious', 'Phishing', 'Simulation'],
      chartData: [],
      chartOptions: {}
    }
    const data = [
      {
        widgetDatas: [
          { dataObject: { ActionRange: 'Undetected' }, values: [{ value: 10 }, { value: 100 }] },
          { dataObject: { ActionRange: 'Malicious' }, values: [{ value: 20 }, { value: 200 }] },
          { dataObject: { ActionRange: 'Phishing' }, values: [{ value: 30 }, { value: 300 }] },
          { dataObject: { ActionRange: 'Simulation' }, values: [{ value: 40 }, { value: 400 }] }
        ]
      }
    ]

    CampaignManagerStatisticsPie.methods.setChartData.call(ctx, data)

    expect(ctx.chartData).toEqual([10, 20, 30, 40])
    expect(ctx.chartOptions.labels).toEqual(['Undetected', 'Malicious', 'Phishing', 'Simulation'])
    expect(ctx.isEmpty).toBe(false)
    expect(ctx.isLoading).toBe(false)
  })

  it('setChartData falls back to 0 for missing action types', () => {
    const ctx = {
      isEmpty: false,
      isLoading: false,
      valueEnums: ['Undetected', 'Malicious', 'Phishing', 'Simulation'],
      chartData: [],
      chartOptions: {}
    }
    const data = [
      {
        widgetDatas: [{ dataObject: { ActionRange: 'Phishing' }, values: [{ value: 55 }, { value: 500 }] }]
      }
    ]

    CampaignManagerStatisticsPie.methods.setChartData.call(ctx, data)

    expect(ctx.chartData).toEqual([0, 0, 55, 0])
  })

  it('handleDelete and handleEdit emit card payload', () => {
    const emit = jest.fn()
    const card = { key: 'k-1' }
    const ctx = { $emit: emit, card }

    CampaignManagerStatisticsPie.methods.handleDelete.call(ctx)
    CampaignManagerStatisticsPie.methods.handleEdit.call(ctx)

    expect(emit).toHaveBeenCalledWith('on-delete', card)
    expect(emit).toHaveBeenCalledWith('on-edit', card)
  })
})
