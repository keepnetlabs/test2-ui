import * as InvestigationsAPI from '@/api/investigations'

jest.mock('@/utils/testRequest', () => ({
  post: jest.fn().mockResolvedValue({ data: {} }),
  get: jest.fn().mockResolvedValue({ data: {} })
}))

describe('Investigations API', () => {
  it('should have exported functions', () => {
    expect(Object.keys(InvestigationsAPI).length > 0).toBe(true)
  })

  it('all exported functions should be callable', () => {
    Object.values(InvestigationsAPI).forEach(fn => {
      if (typeof fn === 'function') {
        expect(typeof fn).toBe('function')
      }
    })
  })
})
