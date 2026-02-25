import AppRouterLink from '@/layout/AppRouterLink.vue'

describe('AppRouterLink.vue', () => {
  it('getClass returns active-link when comparator is truthy', () => {
    const ctx = { comparator: true }
    expect(AppRouterLink.computed.getClass.call(ctx)).toContain('active-link')
  })

  it('getClass omits active-link when comparator is falsy', () => {
    const ctx = { comparator: false }
    expect(AppRouterLink.computed.getClass.call(ctx)).not.toContain('active-link')
  })

  it('comparator uses activeClassComparator when provided', () => {
    const fn = jest.fn(() => true)
    const ctx = { activeClassComparator: fn }
    expect(AppRouterLink.computed.comparator.call(ctx)).toBe(true)
    expect(fn).toHaveBeenCalled()
  })

  it('comparator falls back to routerName === routeName when no comparator', () => {
    expect(AppRouterLink.computed.comparator.call({ routerName: 'A', routeName: 'A' })).toBe(true)
    expect(AppRouterLink.computed.comparator.call({ routerName: 'A', routeName: 'B' })).toBe(false)
  })

  it('has correct component name', () => {
    expect(AppRouterLink.name).toBe('AppRouterLink')
  })
})
