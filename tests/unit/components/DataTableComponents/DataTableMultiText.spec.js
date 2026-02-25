import DataTableMultiText from '@/components/DataTableComponents/DataTableMultiText.vue'

describe('DataTableMultiText.vue', () => {
  it('getTooltipText joins unrendered badges', () => {
    const value = DataTableMultiText.computed.getTooltipText.call({
      badges: ['a', 'b', 'c'],
      maximumRenderedBadgeCount: 1
    })
    expect(value).toBe('b,c')
  })

  it('getMultiplyBy returns size multipliers by text length', () => {
    expect(DataTableMultiText.methods.getMultiplyBy('ab')).toBe(8)
    expect(DataTableMultiText.methods.getMultiplyBy('abcdef')).toBe(6)
    expect(DataTableMultiText.methods.getMultiplyBy('abcdefghijklmnop')).toBe(5)
  })

  it('checkIsChanged detects change when width changed', () => {
    const ctx = { width: 100, badges: ['x'] }
    const changed = DataTableMultiText.methods.checkIsChanged.call(ctx, ['x'], 200)
    expect(changed).toBe(true)
  })
})
