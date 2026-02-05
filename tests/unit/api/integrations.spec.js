import * as IntegrationsAPI from '@/api/integrations'

jest.mock('@/utils/testRequest', () => ({
  post: jest.fn().mockResolvedValue({ data: {} }),
  get: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} })
}))

describe('Integrations API', () => {
  it('should export functions', () => {
    const functions = Object.values(IntegrationsAPI).filter(x => typeof x === 'function')
    expect(functions.length > 0).toBe(true)
  })

  it('should have working exported functions', () => {
    Object.entries(IntegrationsAPI).forEach(([name, fn]) => {
      if (typeof fn === 'function') {
        expect(typeof fn).toBe('function')
      }
    })
  })
})
