import { shallowMount } from '@vue/test-utils'
import ExecutiveReportsIndustryPhishingRiskScore from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsIndustryPhishingRiskScore.vue'
import { getExecutiveReportChartData } from '@/api/reports'

jest.mock('@/api/reports', () => ({
  getExecutiveReportChartData: jest.fn(() => Promise.resolve({ data: { data: [] } }))
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

const makeWidgetData = () => [
  {
    widgetDatas: [
      {
        dataObject: {
          name: 'Campaign 1',
          fullName: 'Campaign Full 1',
          email: 'a@keepnetlabs.com',
          department: 'IT',
          phishingType: 'Phishing',
          startDate: '2026-01-01',
          totalClickedCount: 2,
          totalSubmittedCount: 1,
          totalMfaSubmittedCount: 1,
          totalAttachmentOpenedCount: 1,
          totalScanQRCount: 0,
          totalVishedCount: 0,
          totalCalledCount: 0,
          totalEnteredCount: 0,
          totalReportedCount: 3,
          totalMetrics: 5,
          totalDeliveredCount: 100,
          riskScore: 12
        },
        values: [
          { name: 'RiskScore', value: 12 },
          { name: 'TotalMetrics', value: 5 },
          { name: 'TotalReportedCount', value: 3 },
          { name: 'IndustryAverage', value: 2, label: 'Industry Average 2%' }
        ]
      },
      {
        dataObject: {
          name: 'Campaign 2',
          fullName: 'Campaign Full 2',
          email: 'b@keepnetlabs.com',
          department: 'HR',
          phishingType: 'Smishing',
          startDate: '2026-01-02',
          totalClickedCount: 1,
          totalSubmittedCount: 1,
          totalMfaSubmittedCount: 0,
          totalAttachmentOpenedCount: 0,
          totalScanQRCount: 0,
          totalVishedCount: 0,
          totalCalledCount: 0,
          totalEnteredCount: 0,
          totalReportedCount: 1,
          totalMetrics: 2,
          totalDeliveredCount: 50,
          riskScore: 8
        },
        values: [
          { name: 'RiskScore', value: 8 },
          { name: 'TotalMetrics', value: 2 },
          { name: 'TotalReportedCount', value: 1 },
          { name: 'IndustryAverage', value: 2, label: 'Industry Average 2%' }
        ]
      }
    ]
  }
]

describe('ExecutiveReportsIndustryPhishingRiskScore.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(ExecutiveReportsIndustryPhishingRiskScore, {
      propsData: {
        card: {
          title: 'Industry Phishing Risk Score',
          parentKey: 'Executive Reports',
          resourceId: 'wid-1',
          key: 'industryPhishingRiskScore'
        },
        dateRange: ['2026-01-01', '2026-01-31'],
        datePeriod: 1,
        ...propsData
      },
      stubs: {
        WidgetLoading: true,
        BarChart: true,
        ExecutiveWidgetContainer: true,
        ExecutiveWidgetHeader: true,
        ExecutiveWidgetBody: true,
        VBtn: true,
        VIcon: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('created uses defaultWidgetData when provided', () => {
    const setChartDataSpy = jest.spyOn(
      ExecutiveReportsIndustryPhishingRiskScore.methods,
      'setChartData'
    )

    createWrapper({ defaultWidgetData: makeWidgetData() })

    expect(setChartDataSpy).toHaveBeenCalled()
    expect(getExecutiveReportChartData).not.toHaveBeenCalled()
    setChartDataSpy.mockRestore()
  })

  it('callForData fetches chart data, emits cache event and clears loading', async () => {
    getExecutiveReportChartData.mockResolvedValueOnce({
      data: { data: makeWidgetData() }
    })
    const wrapper = createWrapper({ defaultWidgetData: [] })

    wrapper.vm.callForData()
    await flushPromises()

    expect(getExecutiveReportChartData).toHaveBeenCalledWith({
      widgetIds: ['wid-1'],
      datePeriod: 1,
      startDate: '2026-01-01',
      endDate: '2026-01-31'
    })
    expect(wrapper.emitted('on-set-default-widget-data')).toBeTruthy()
    expect(wrapper.emitted('on-set-default-widget-data')[0][0]).toBe('industryPhishingRiskScore')
    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('setChartData marks widget empty when dataset is missing', () => {
    const wrapper = createWrapper({ defaultWidgetData: [] })
    wrapper.vm.setChartData([{ widgetDatas: [] }])

    expect(wrapper.vm.isEmpty).toBe(true)
    expect(wrapper.vm.industryAverageObj).toBe(null)
  })

  it('setChartData builds chart datasets/options and updates title with industry average', () => {
    const wrapper = createWrapper({ defaultWidgetData: [] })
    wrapper.vm.setChartData(makeWidgetData())

    expect(wrapper.vm.isEmpty).toBe(false)
    expect(wrapper.vm.chartData.labels).toEqual(['Campaign 1', 'Campaign 2'])
    expect(wrapper.vm.chartData.datasets).toHaveLength(4)
    expect(wrapper.vm.chartOptions).toHaveProperty('scales')
    expect(wrapper.vm.getTitle).toBe('Industry Phishing Risk Score: 2%')
  })

  it('dateRange watcher triggers callForData', () => {
    const callForData = jest.fn()
    ExecutiveReportsIndustryPhishingRiskScore.watch.dateRange.call({ callForData })
    expect(callForData).toHaveBeenCalled()
  })

  it('handleDelete and handleEdit emit card payload', () => {
    const wrapper = createWrapper({ defaultWidgetData: [] })

    wrapper.vm.handleDelete()
    wrapper.vm.handleEdit()

    expect(wrapper.emitted('on-delete')[0][0]).toEqual(wrapper.vm.card)
    expect(wrapper.emitted('on-edit')[0][0]).toEqual(wrapper.vm.card)
  })
})
