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
    expect(createExecutiveReportChartData(undefined)).toEqual({
      valueEnums: [],
      datasets: []
    })
    expect(createExecutiveReportChartData({})).toEqual({
      valueEnums: [],
      datasets: []
    })
  })

  it('returns empty result for empty array', () => {
    expect(createExecutiveReportChartData([])).toEqual({
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

  it('creates chart data with YYYY/MM/DD format', () => {
    const widgetData = [
      {
        date: '2025/06/15 00:00',
        values: [{ label: 'Score', value: 75, name: 'Percentage' }]
      }
    ]
    const result = createExecutiveReportChartData(widgetData, 'YYYY/MM/DD')
    expect(result.datasets).toHaveLength(1)
    expect(result.datasets[0].name).toBe('Percentage')
    expect(result.datasets[0].y).toBe(75)
  })

  it('creates chart data with DD/MM/YYYY format', () => {
    const widgetData = [
      {
        date: '15/06/2025 00:00',
        values: [{ label: 'X', value: 1 }]
      }
    ]
    const result = createExecutiveReportChartData(widgetData, 'DD/MM/YYYY')
    expect(result.datasets).toHaveLength(1)
    expect(result.datasets[0].x).toBeDefined()
  })

  it('includes annotations when present in value', () => {
    const widgetData = [
      {
        date: '01/15/2025 00:00',
        values: [{ label: 'L', value: 1, annotations: 'note' }]
      }
    ]
    const result = createExecutiveReportChartData(widgetData, 'MM/DD/YYYY')
    expect(result.datasets[0].annotations).toBe('note')
  })

  it('exports date period enums', () => {
    expect(DATE_PERIOD_ENUMS.Custom).toBe(5)
    expect(DATE_PERIOD_ENUMS.LastMonth).toBe(0)
    expect(DATE_PERIOD_ENUMS.Last3Months).toBe(1)
    expect(DATE_PERIOD_ENUMS.LastYear).toBe(3)
  })
})
