import ExecutiveReportsTotalReportedSuspiciousDoughnut from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsTotalReportedSuspiciousDoughnut.vue'
import labels from '@/model/constants/labels'
import { SIMULATION_SOURCE_NOTE } from '@/components/ExecutiveReports/ExecutiveReportsCharts/utils'

const makeWidgetData = () => [
  {
    widgetDatas: [
      {
        dataObject: { ActionRange: 'Undetected' },
        values: [{ value: 0 }, { value: 0 }]
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

describe('ExecutiveReportsTotalReportedSuspiciousDoughnut.vue', () => {
  it('has correct component name', () => {
    expect(ExecutiveReportsTotalReportedSuspiciousDoughnut.name).toBe(
      'ExecutiveReportsTotalReportedSuspiciousDoughnut'
    )
  })

  it('exposes simulation source note for the widget', () => {
    expect(ExecutiveReportsTotalReportedSuspiciousDoughnut.data().simulationSourceNote).toBe(
      SIMULATION_SOURCE_NOTE
    )
  })

  it('dateRange watcher triggers callForData', () => {
    const ctx = { callForData: jest.fn() }
    ExecutiveReportsTotalReportedSuspiciousDoughnut.watch.dateRange.call(ctx)
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('setChartData sets empty state when no valid values', () => {
    const ctx = { isEmpty: false }
    ExecutiveReportsTotalReportedSuspiciousDoughnut.methods.setChartData.call(ctx, [
      { widgetDatas: [] }
    ])
    expect(ctx.isEmpty).toBe(true)
  })

  it('setChartData keeps doughnut labels aligned with non-zero values', () => {
    const ctx = {
      valueEnums: [labels.Undetected, labels.Malicious, labels.Phishing, labels.Simulation],
      chartData: [],
      chartOptions: {},
      isEmpty: true,
      isLoading: true
    }

    ExecutiveReportsTotalReportedSuspiciousDoughnut.methods.setChartData.call(ctx, makeWidgetData())

    expect(ctx.chartData.labels).toEqual([labels.Malicious, labels.Simulation])
    expect(ctx.chartData.datasets[0].data).toEqual([6, 3])
    const legendLabels = ctx.chartOptions.legend.labels.generateLabels({
      data: { labels: ctx.chartData.labels }
    })
    expect(legendLabels.map((item) => item.textParts)).toEqual([
      [labels.Malicious, 2],
      [labels.Simulation, 1]
    ])
  })

  it('handleDelete and handleEdit emit events', () => {
    const card = { resourceId: 'r2' }
    const ctx = { card, $emit: jest.fn() }
    ExecutiveReportsTotalReportedSuspiciousDoughnut.methods.handleDelete.call(ctx)
    ExecutiveReportsTotalReportedSuspiciousDoughnut.methods.handleEdit.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-delete', card)
    expect(ctx.$emit).toHaveBeenCalledWith('on-edit', card)
  })
})
