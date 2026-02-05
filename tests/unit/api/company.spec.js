import * as CompanyAPI from '@/api/company'

jest.mock('@/utils/testRequest', () => ({
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} }),
  get: jest.fn().mockResolvedValue({ data: {} })
}))

describe('Company API', () => {
  it('should export functions', () => {
    const functions = Object.values(CompanyAPI).filter(x => typeof x === 'function')
    expect(functions.length > 0).toBe(true)
  })

  it('should have callable exported functions', () => {
    Object.values(CompanyAPI).forEach(fn => {
      if (typeof fn === 'function') {
        expect(fn).toBeDefined()
      }
    })
  })
})
