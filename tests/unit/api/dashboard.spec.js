import * as DashboardAPI from '@/api/dashboard'

jest.mock('@/utils/testRequest', () => ({
  post: jest.fn().mockResolvedValue({ data: {} }),
  get: jest.fn().mockResolvedValue({ data: {} })
}))

describe('Dashboard API', () => {
  const expectedFunctions = [
    'getAuditLogs',
    'exportAuditLog'
  ]

  expectedFunctions.forEach(func => {
    it(`should have ${func} function`, () => {
      expect(typeof DashboardAPI[func]).toBe('function')
    })
  })

  it('exported functions should return promises', () => {
    const result = DashboardAPI.getAuditLogs({ test: 'payload' })
    expect(result).toHaveProperty('then')
  })
})
