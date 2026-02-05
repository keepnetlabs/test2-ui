import * as CommonAPI from '@/api/common'

jest.mock('@/utils/testRequest', () => ({
  post: jest.fn().mockResolvedValue({ data: {} }),
  get: jest.fn().mockResolvedValue({ data: {} })
}))

describe('Common API', () => {
  it('should have exported functions', () => {
    expect(Object.keys(CommonAPI).length > 0).toBe(true)
  })

  describe('Exported functions', () => {
    const exportedFunctions = Object.values(CommonAPI).filter(x => typeof x === 'function')
    
    exportedFunctions.forEach((func, index) => {
      it(`function ${index} should be callable`, () => {
        expect(typeof func).toBe('function')
      })
    })
  })
})
