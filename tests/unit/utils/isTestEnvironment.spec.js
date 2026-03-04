import { isTestEnvironment } from '@/utils/isTestEnvironment'

describe('isTestEnvironment', () => {
  const originalLocation = globalThis.location

  afterEach(() => {
    Object.defineProperty(globalThis, 'location', {
      value: originalLocation,
      configurable: true
    })
  })

  it('returns true for localhost', () => {
    Object.defineProperty(globalThis, 'location', {
      value: { hostname: 'localhost' },
      configurable: true
    })
    expect(isTestEnvironment()).toBe(true)
  })

  it('returns true for test-ui.devkeepnet.com', () => {
    Object.defineProperty(globalThis, 'location', {
      value: { hostname: 'test-ui.devkeepnet.com' },
      configurable: true
    })
    expect(isTestEnvironment()).toBe(true)
  })

  it('returns false for production hostname', () => {
    Object.defineProperty(globalThis, 'location', {
      value: { hostname: 'app.keepnetlabs.com' },
      configurable: true
    })
    expect(isTestEnvironment()).toBe(false)
  })

  it('returns false for other production hostnames', () => {
    Object.defineProperty(globalThis, 'location', {
      value: { hostname: 'keepnetlabs.com' },
      configurable: true
    })
    expect(isTestEnvironment()).toBe(false)

    Object.defineProperty(globalThis, 'location', {
      value: { hostname: 'dashboard.keepnetlabs.com' },
      configurable: true
    })
    expect(isTestEnvironment()).toBe(false)
  })

  it('returns false for 127.0.0.1', () => {
    Object.defineProperty(globalThis, 'location', {
      value: { hostname: '127.0.0.1' },
      configurable: true
    })
    expect(isTestEnvironment()).toBe(false)
  })
})
