import {
  getTimezones,
  getLookupListByTypeId,
  getLookupListByTypeIdList,
  getLicences,
  getTicket,
  getCountryTimezones
} from '@/api/common'
import testRequest from '@/utils/testRequest'

jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} })
}))

describe('common API (extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getTimezones', () => {
    it('calls GET /timezone/timezones', async () => {
      await getTimezones()
      expect(testRequest.get).toHaveBeenCalledWith('/timezone/timezones')
    })
  })

  describe('getLookupListByTypeId', () => {
    it('calls GET lookups/:id', async () => {
      await getLookupListByTypeId('type-1')
      expect(testRequest.get).toHaveBeenCalledWith('lookups/type-1')
    })
  })

  describe('getLookupListByTypeIdList', () => {
    it('calls POST lookups', async () => {
      await getLookupListByTypeIdList({ ids: ['a', 'b'] })
      expect(testRequest.post).toHaveBeenCalledWith('lookups', { ids: ['a', 'b'] })
    })
  })

  describe('getLicences', () => {
    it('calls GET /lookups/licenses', async () => {
      await getLicences()
      expect(testRequest.get).toHaveBeenCalledWith('/lookups/licenses')
    })
  })

  describe('getTicket', () => {
    it('calls GET /reports/ticket', async () => {
      await getTicket()
      expect(testRequest.get).toHaveBeenCalledWith('/reports/ticket')
    })
  })

  describe('getCountryTimezones', () => {
    it('calls GET /lookups/country-timezones', async () => {
      await getCountryTimezones()
      expect(testRequest.get).toHaveBeenCalledWith('/lookups/country-timezones')
    })
  })
})
