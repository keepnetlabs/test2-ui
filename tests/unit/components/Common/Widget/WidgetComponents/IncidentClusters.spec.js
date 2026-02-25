import IncidentClusters from '@/components/Common/Widget/WidgetComponents/IncidentClusters.vue'

describe('IncidentClusters.vue', () => {
  it('has correct component name', () => {
    expect(IncidentClusters.name).toBe('IncidentClusters')
  })

  it('getTitle returns IncidentClusters label value', () => {
    const title = IncidentClusters.computed.getTitle.call({})
    expect(typeof title).toBe('string')
    expect(title.length).toBeGreaterThan(0)
  })

  it('data contains chart options and datasets', () => {
    const data = IncidentClusters.data()
    expect(data.chartOptions).toBeDefined()
    expect(Array.isArray(data.chartData)).toBe(true)
    expect(data.chartData.length).toBeGreaterThan(0)
    expect(data.chartData[0]).toHaveProperty('label')
    expect(data.chartData[0]).toHaveProperty('data')
  })
})
