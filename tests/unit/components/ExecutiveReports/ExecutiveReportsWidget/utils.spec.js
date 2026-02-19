import {
  createExecutiveReportChartData,
  DATE_PERIOD_ENUMS
} from '@/components/ExecutiveReports/ExecutiveReportsWidget/utils'

describe('ExecutiveReportsWidget utils', () => {
  it('returns empty result for invalid input', () => {
    expect(createExecutiveReportChartData(null)).toEqual({
      valueEnums: [],
      datasets: []
    })
  })

  it('creates chart datasets and valueEnums with provided date format', () => {
    const widgetData = [
      {
        date: '12/31/2025 00:00:00',
        values: [
          { label: 'Clicked', value: 10, name: 'A' },
          { label: 'Opened', value: 20, annotations: ['x'] }
        ]
      }
    ]

    const result = createExecutiveReportChartData(widgetData, 'MM/DD/YYYY')
    expect(result.valueEnums.sort()).toEqual(['Clicked', 'Opened'])
    expect(result.datasets).toHaveLength(2)
    expect(result.datasets[0]).toHaveProperty('x')
    expect(result.datasets[0]).toHaveProperty('y', 10)
  })

  it('exports date period enums', () => {
    expect(DATE_PERIOD_ENUMS.Custom).toBe(5)
    expect(DATE_PERIOD_ENUMS.LastMonth).toBe(0)
  })
})
