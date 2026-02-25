import DataTableChart from '@/components/DataTableComponents/DataTableChart.vue'

describe('DataTableChart.vue', () => {
  it('shouldRenderTooltip returns true when chart data has non-zero values', () => {
    const value = DataTableChart.computed.shouldRenderTooltip.call({
      $props: { scope: { row: { stats: [0, 1] } }, col: { property: 'stats' } }
    })
    expect(value).toBe(true)
  })

  it('shouldRenderTooltip returns false when all values are zero', () => {
    const value = DataTableChart.computed.shouldRenderTooltip.call({
      $props: { scope: { row: { stats: [0, 0] } }, col: { property: 'stats' } }
    })
    expect(value).toBe(false)
  })
})
