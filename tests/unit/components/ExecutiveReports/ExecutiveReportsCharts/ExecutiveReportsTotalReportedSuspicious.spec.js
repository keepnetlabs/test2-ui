import ExecutiveReportsTotalReportedSuspicious from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsTotalReportedSuspicious.vue'
import { SIMULATION_SOURCE_NOTE } from '@/components/ExecutiveReports/ExecutiveReportsCharts/utils'

const makeWidgetData = () => [
  {
    widgetDatas: [
      {
        dataObject: { ActionRange: 'Undetected' },
        values: [{ value: 20 }, { value: 20 }]
      },
      {
        dataObject: { ActionRange: 'Malicious' },
        values: [{ value: 10 }, { value: 10 }]
      },
      {
        dataObject: { ActionRange: 'Phishing' },
        values: [{ value: 0 }, { value: 0 }]
      },
      {
        dataObject: {
          ActionRange: 'Simulation',
          sourceBreakdown: {
            incidentResponderCount: 1,
            campaignCount: 2,
            campaigns: [{ campaignName: 'Q1 Campaign', count: 2 }]
          }
        },
        values: [{ value: 3 }, { value: 3 }]
      }
    ]
  }
]

describe('ExecutiveReportsTotalReportedSuspicious.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportsTotalReportedSuspicious.name).toBe('ExecutiveReportsTotalReportedSuspicious')
  })

  it('exposes simulation source note for the widget', () => {
    expect(ExecutiveReportsTotalReportedSuspicious.data().simulationSourceNote).toBe(
      SIMULATION_SOURCE_NOTE
    )
  })

  it('dateRange watcher triggers callForData', () => {
    const ctx = { callForData: jest.fn() }
    ExecutiveReportsTotalReportedSuspicious.watch.dateRange.call(ctx)
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('setChartData sets empty state when widget data is missing', () => {
    const ctx = { isEmpty: false }
    ExecutiveReportsTotalReportedSuspicious.methods.setChartData.call(ctx, [])
    expect(ctx.isEmpty).toBe(true)
  })

  it('setChartData adds simulation source breakdown to tooltip details', () => {
    const ctx = {
      chartData: {},
      chartOptions: {},
      isEmpty: true,
      isLoading: true
    }

    ExecutiveReportsTotalReportedSuspicious.methods.setChartData.call(ctx, makeWidgetData())

    const simulationPoint = ctx.chartData.datasets[0].data.find((item) => item.y === 'Simulation')
    expect(simulationPoint.details).toMatchObject({
      'Number of Reporting': 3,
      'Percentage of Reporting': '3%',
      'Incident Responder': 1,
      'Campaign Report > Reporters': 2,
      Campaigns: 'Q1 Campaign (2)'
    })
    expect(ctx.isEmpty).toBe(false)
  })

  it('handleDelete and handleEdit emit events', () => {
    const card = { resourceId: 'r1' }
    const ctx = { card, $emit: jest.fn() }
    ExecutiveReportsTotalReportedSuspicious.methods.handleDelete.call(ctx)
    ExecutiveReportsTotalReportedSuspicious.methods.handleEdit.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-delete', card)
    expect(ctx.$emit).toHaveBeenCalledWith('on-edit', card)
  })
})
