import { CHART_COLORS, monthNamesLong } from '@/components/ExecutiveReports/ExecutiveReportsCharts/utils'
import labels from '@/model/constants/labels'

describe('ExecutiveReportsCharts utils', () => {
  it('contains chart styles for core keys', () => {
    expect(CHART_COLORS).toHaveProperty('Clicked (%)')
    expect(CHART_COLORS).toHaveProperty('Open Attachment')
    expect(CHART_COLORS).toHaveProperty(labels.NoResponse)
    expect(CHART_COLORS['Clicked (%)'].backgroundColor).toBe('#2196F3')
  })

  it('exports full month names', () => {
    expect(monthNamesLong).toHaveLength(12)
    expect(monthNamesLong[0]).toBe('January')
    expect(monthNamesLong[11]).toBe('December')
  })
})
