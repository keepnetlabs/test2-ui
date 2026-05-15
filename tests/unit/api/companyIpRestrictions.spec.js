jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({})
}))

import testRequest from '@/utils/testRequest'
import * as companyIpRestrictionsApi from '@/api/companyIpRestrictions'
import { expectNamespaceExportsOnlyFunctions } from '../helpers/expectNamespaceExportsOnlyFunctions'

describe('companyIpRestrictions API', () => {
  const API_URL = '/companies/ip-restrictions'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('gets company IP restrictions', async () => {
    await companyIpRestrictionsApi.getCompanyIpRestrictions()

    expect(testRequest.get).toHaveBeenCalledWith(API_URL)
  })

  it('creates company IP restrictions with json-patch content type', async () => {
    const payload = { ipRanges: ['192.168.1.0/24'] }

    await companyIpRestrictionsApi.createCompanyIpRestrictions(payload)

    expect(testRequest.post).toHaveBeenCalledWith(API_URL, payload, {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json-patch+json'
      }
    })
  })

  it('creates company IP restrictions with empty payload by default', async () => {
    await companyIpRestrictionsApi.createCompanyIpRestrictions()

    expect(testRequest.post).toHaveBeenCalledWith(API_URL, {}, expect.any(Object))
  })

  it('deletes a company IP restriction by resource id', async () => {
    await companyIpRestrictionsApi.deleteCompanyIpRestriction('abc')

    expect(testRequest.delete).toHaveBeenCalledWith(`${API_URL}/abc`)
  })

  it('deletes with empty resource id by default', async () => {
    await companyIpRestrictionsApi.deleteCompanyIpRestriction()

    expect(testRequest.delete).toHaveBeenCalledWith(`${API_URL}/`)
  })

  it('does not configure automatic snackbar for save requests', async () => {
    await companyIpRestrictionsApi.createCompanyIpRestrictions({ ipRanges: ['10.0.0.1'] })
    await companyIpRestrictionsApi.deleteCompanyIpRestriction('abc')

    expect(testRequest.post.mock.calls[0][2]).not.toHaveProperty('snackbar')
    expect(testRequest.delete.mock.calls[0][1]).toBeUndefined()
  })

  it('exports only request functions', () => {
    expectNamespaceExportsOnlyFunctions(companyIpRestrictionsApi)
  })
})
