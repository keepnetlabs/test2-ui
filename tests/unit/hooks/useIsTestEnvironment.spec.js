import useIsTestEnvironment from '@/hooks/useIsTestEnvironment'

describe('useIsTestEnvironment', () => {
  it('exports mixin object with computed', () => {
    expect(useIsTestEnvironment).toBeDefined()
    expect(useIsTestEnvironment.computed).toBeDefined()
    expect(typeof useIsTestEnvironment.computed.isTestEnvironment).toBe('function')
  })

  it('isTestEnvironment computed returns true for localhost', () => {
    const originalLocation = globalThis.location
    Object.defineProperty(globalThis, 'location', {
      value: { hostname: 'localhost' },
      configurable: true
    })

    const getter = useIsTestEnvironment.computed.isTestEnvironment
    expect(getter.call({})).toBe(true)

    Object.defineProperty(globalThis, 'location', {
      value: originalLocation,
      configurable: true
    })
  })

  it('isTestEnvironment computed returns false for production host', () => {
    const originalLocation = globalThis.location
    Object.defineProperty(globalThis, 'location', {
      value: { hostname: 'app.keepnetlabs.com' },
      configurable: true
    })

    const getter = useIsTestEnvironment.computed.isTestEnvironment
    expect(getter.call({})).toBe(false)

    Object.defineProperty(globalThis, 'location', {
      value: originalLocation,
      configurable: true
    })
  })
})
