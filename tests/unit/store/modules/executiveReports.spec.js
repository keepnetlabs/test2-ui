import executiveReports from '@/store/modules/executiveReports'

describe('executiveReports Vuex Module', () => {
  it('should be a valid module', () => {
    expect(executiveReports).toBeDefined()
  })

  it('should have state', () => {
    expect(executiveReports.state).toBeDefined()
  })

  it('should have state as object or function', () => {
    expect(typeof executiveReports.state === 'object' || typeof executiveReports.state === 'function').toBe(true)
  })
})
