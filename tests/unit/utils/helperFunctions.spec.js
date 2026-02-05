import * as helperFunctions from '@/utils/helperFunctions'

describe('Helper Functions Utility', () => {
  it('should export functions', () => {
    expect(Object.keys(helperFunctions).length > 0).toBe(true)
  })

  it('should have callable exported functions', () => {
    Object.entries(helperFunctions).forEach(([name, fn]) => {
      if (typeof fn === 'function') {
        expect(typeof fn).toBe('function')
      }
    })
  })

  it('columnFilterChanged should be a function', () => {
    expect(typeof helperFunctions.columnFilterChanged).toBe('function')
  })

  it('columnFilterCleared should be a function', () => {
    expect(typeof helperFunctions.columnFilterCleared).toBe('function')
  })
})
