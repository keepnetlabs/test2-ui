import DataTableProgress from '@/components/DataTableComponents/DataTableProgress.vue'

describe('DataTableProgress.vue', () => {
  it('hasValidProgress returns true for numeric non-negative values', () => {
    const value = DataTableProgress.computed.hasValidProgress.call({
      scope: { row: { progress: '20' } },
      col: { property: 'progress' }
    })
    expect(value).toBe(true)
  })

  it('hasValidProgress returns false for invalid values', () => {
    const value = DataTableProgress.computed.hasValidProgress.call({
      scope: { row: { progress: 'abc' } },
      col: { property: 'progress' }
    })
    expect(value).toBe(false)
  })
})
