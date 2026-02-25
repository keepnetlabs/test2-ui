jest.mock('@/utils/functions', () => ({
  __esModule: true,
  createRandomCryptStringNumber: jest.fn(() => 'rnd')
}))

import KSmartGrid from '@/components/Common/Widget/KSmartGrid.vue'

describe('KSmartGrid.vue', () => {
  it('has correct component name', () => {
    expect(KSmartGrid.name).toBe('KSmartGrid')
  })

  it('pick returns only existing keys from source object', () => {
    const result = KSmartGrid.methods.pick.call(
      {},
      { a: 1, b: 2 },
      ['b', 'c']
    )
    expect(result).toEqual({ b: 2 })
  })

  it('event forwarding methods emit structured payloads', () => {
    const $emit = jest.fn()
    const ctx = { $emit }

    KSmartGrid.methods.moveEvent.call(ctx, 'i1', 1, 2)
    KSmartGrid.methods.resizeEvent.call(ctx, 'i1', 10, 20, 100, 200)
    KSmartGrid.methods.breakPointChanged.call(ctx, 'lg', [{ i: 'x' }])

    expect($emit).toHaveBeenCalledWith('move', { i: 'i1', newX: 1, newY: 2 })
    expect($emit).toHaveBeenCalledWith('resize', {
      i: 'i1',
      newH: 10,
      newW: 20,
      newHPx: 100,
      newWPx: 200
    })
    expect($emit).toHaveBeenCalledWith('breakpointChanged', {
      newBreakpoint: 'lg',
      newLayout: [{ i: 'x' }]
    })
  })

  it('forceRenderGrid regenerates keyGrid', () => {
    const ctx = { keyGrid: 'key-old' }
    KSmartGrid.methods.forceRenderGrid.call(ctx)
    expect(ctx.keyGrid).toBe('key-rnd')
  })
})
