import ExecutiveReportsTotalReportedSuspiciousPie from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsTotalReportedSuspiciousPie.vue'
import labels from '@/model/constants/labels'
import { SIMULATION_SOURCE_NOTE } from '@/components/ExecutiveReports/ExecutiveReportsCharts/utils'

const makeWidgetData = () => [
  {
    widgetDatas: [
      {
        dataObject: { ActionRange: 'Undetected' },
        values: [{ value: 91 }, { value: 29 }]
      },
      {
        dataObject: { ActionRange: 'Malicious' },
        values: [{ value: 6 }, { value: 2 }]
      },
      {
        dataObject: { ActionRange: 'Phishing' },
        values: [{ value: 0 }, { value: 0 }]
      },
      {
        dataObject: {
          ActionRange: 'Simulation',
          sourceBreakdown: {
            incidentResponderCount: 0,
            campaignCount: 1,
            campaigns: [{ campaignName: 'SpearTip Test', count: 1 }]
          }
        },
        values: [{ value: 3 }, { value: 1 }]
      }
    ]
  }
]

describe('ExecutiveReportsTotalReportedSuspiciousPie.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportsTotalReportedSuspiciousPie.name).toBe(
      'ExecutiveReportsTotalReportedSuspiciousPie'
    )
  })

  it('exposes simulation source note for the widget', () => {
    expect(ExecutiveReportsTotalReportedSuspiciousPie.data().simulationSourceNote).toBe(
      SIMULATION_SOURCE_NOTE
    )
  })

  it('dateRange watcher triggers callForData', () => {
    const ctx = { callForData: jest.fn() }
    ExecutiveReportsTotalReportedSuspiciousPie.watch.dateRange.call(ctx)
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('setChartData sets empty state when no data', () => {
    const ctx = { isEmpty: false }
    ExecutiveReportsTotalReportedSuspiciousPie.methods.setChartData.call(ctx, [])
    expect(ctx.isEmpty).toBe(true)
  })

  it('setChartData keeps simulation count available in legend labels', () => {
    const ctx = {
      valueEnums: [labels.Undetected, labels.Malicious, labels.Phishing, labels.Simulation],
      chartData: [],
      chartOptions: {},
      isEmpty: true,
      isLoading: true
    }

    ExecutiveReportsTotalReportedSuspiciousPie.methods.setChartData.call(ctx, makeWidgetData())

    const legendLabels = ctx.chartOptions.legend.labels.generateLabels({
      data: { labels: ctx.valueEnums }
    })
    expect(legendLabels[3].textParts).toEqual(['Simulation', 1])
    expect(ctx.chartData).toEqual([91, 6, 0, 3])
  })

  it('handleDelete and handleEdit emit events', () => {
    const card = { resourceId: 'r3' }
    const ctx = { card, $emit: jest.fn() }
    ExecutiveReportsTotalReportedSuspiciousPie.methods.handleDelete.call(ctx)
    ExecutiveReportsTotalReportedSuspiciousPie.methods.handleEdit.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-delete', card)
    expect(ctx.$emit).toHaveBeenCalledWith('on-edit', card)
  })
})
