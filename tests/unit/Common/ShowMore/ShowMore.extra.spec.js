import ShowMore from '@/components/Common/ShowMore/ShowMore.vue'

describe('ShowMore.vue (extra methods)', () => {
  const { methods } = ShowMore

  it('getContainerWidth returns 0 when ref is missing', () => {
    const ctx = {
      unRenderedBadgeCount: 0,
      $refs: {}
    }
    expect(methods.getContainerWidth.call(ctx)).toBe(0)
  })

  it('getContainerWidth subtracts 60 when no hidden badges remain', () => {
    const ctx = {
      unRenderedBadgeCount: 0,
      $refs: {
        refLeftContainer: {
          getBoundingClientRect: () => ({ width: 200.8 })
        }
      }
    }
    expect(methods.getContainerWidth.call(ctx)).toBe(140)
  })

  it('getContainerWidth does not subtract when hidden badges exist', () => {
    const ctx = {
      unRenderedBadgeCount: 2,
      $refs: {
        refLeftContainer: {
          getBoundingClientRect: () => ({ width: 200.8 })
        }
      }
    }
    expect(methods.getContainerWidth.call(ctx)).toBe(200)
  })

  it('getChips sets single item state directly', () => {
    const ctx = {
      computedData: [{ name: 'one' }],
      renderedBadgeCount: 0,
      unRenderedBadgeCount: 5,
      getContainerWidth: () => 300
    }
    methods.getChips.call(ctx)
    expect(ctx.renderedBadgeCount).toBe(1)
    expect(ctx.unRenderedBadgeCount).toBe(0)
  })

  it('getChips computes hidden count when width is insufficient', () => {
    const ctx = {
      computedData: [{ name: 'alpha' }, { name: 'beta' }],
      renderedBadgeCount: 0,
      unRenderedBadgeCount: 0,
      getContainerWidth: () => 20
    }
    methods.getChips.call(ctx)
    expect(ctx.renderedBadgeCount).toBe(0)
    expect(ctx.unRenderedBadgeCount).toBe(2)
  })

  it('produceData flattens objects and removes resourceId/falsy values', () => {
    const ctx = {
      data: [
        { resourceId: 'r-1', name: 'Alice', dept: '' },
        { title: 'Manager', active: null }
      ],
      computedData: []
    }
    methods.produceData.call(ctx)
    expect(ctx.computedData).toEqual([{ name: 'Alice' }, { title: 'Manager' }])
  })

  it('getRenderStatusOfButton returns true only when there are hidden items', () => {
    expect(
      methods.getRenderStatusOfButton.call({
        renderedBadgeCount: 1,
        computedData: [{}, {}],
        unRenderedBadgeCount: 1
      })
    ).toBe(true)
    expect(
      methods.getRenderStatusOfButton.call({
        renderedBadgeCount: 2,
        computedData: [{}, {}],
        unRenderedBadgeCount: 0
      })
    ).toBe(false)
  })
})
