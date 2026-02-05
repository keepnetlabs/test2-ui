import * as DomainsAPI from '@/api/domains'

jest.mock('@/utils/testRequest', () => ({
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} }),
  get: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} })
}))

describe('Domains API', () => {
  const functions = [
    'getDomainsList',
    'createDomain',
    'updateDomain',
    'deleteEmailTemplate',
    'exportDnsService',
    'getDomainData',
    'getDomainEditData',
    'testDomainConnection'
  ]

  functions.forEach(func => {
    it(`should export ${func} function`, () => {
      expect(typeof DomainsAPI[func]).toBe('function')
    })
  })

  describe('API Calls', () => {
    it('getDomainsList should return a promise', () => {
      const result = DomainsAPI.getDomainsList({ test: 'payload' })
      expect(result).toHaveProperty('then')
    })

    it('createDomain should return a promise', () => {
      const result = DomainsAPI.createDomain({ test: 'domain' })
      expect(result).toHaveProperty('then')
    })

    it('getDomainData should return a promise', () => {
      const result = DomainsAPI.getDomainData()
      expect(result).toHaveProperty('then')
    })

    it('testDomainConnection should return a promise', () => {
      const result = DomainsAPI.testDomainConnection({ test: 'payload' })
      expect(result).toHaveProperty('then')
    })
  })
})
