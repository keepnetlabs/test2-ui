import TestPie from '@/components/TestHelpers/TestPie.vue'

describe('TestPie.vue', () => {
  it('data returns series array', () => {
    const data = TestPie.data()
    expect(data.series).toEqual([44, 80])
  })

  it('data returns chartOptions with labels', () => {
    const data = TestPie.data()
    expect(data.chartOptions.labels).toEqual(['Phishing', 'Malicious'])
    expect(data.chartOptions.legend).toBeDefined()
  })
})
