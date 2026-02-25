import TestBubble from '@/components/TestHelpers/TestBubble.vue'

describe('TestBubble.vue', () => {
  it('data returns chartOptions with scales', () => {
    const data = TestBubble.data()
    expect(data.chartOptions.scales).toBeDefined()
    expect(data.chartOptions.scales.xAxes).toHaveLength(1)
    expect(data.chartOptions.scales.yAxes).toHaveLength(1)
  })

  it('data returns chartData with labels', () => {
    const data = TestBubble.data()
    expect(data.chartData).toBeDefined()
    expect(data.chartData.length).toBeGreaterThan(0)
    expect(data.chartData[0].label).toBe('Phishing')
    expect(data.chartData[0].data).toBeDefined()
  })
})
