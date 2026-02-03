jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockReturnValue(Promise.resolve({})),
  post: jest.fn().mockReturnValue(Promise.resolve({}))
}))

import testRequest from '@/utils/testRequest'
import * as commonApi from '@/api/common'

describe('common API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('timezone operations', () => {
    it('should call getTimezones', async () => {
      await commonApi.getTimezones()
      expect(testRequest.get).toHaveBeenCalledWith('/timezone/timezones')
    })

    it('should call getCountryTimezones', async () => {
      await commonApi.getCountryTimezones()
      expect(testRequest.get).toHaveBeenCalledWith('/lookups/country-timezones')
    })
  })

  describe('lookup operations', () => {
    it('should call getLookupListByTypeId', async () => {
      const id = 'lookup-123'
      await commonApi.getLookupListByTypeId(id)
      expect(testRequest.get).toHaveBeenCalledWith(`lookups/${id}`)
    })

    it('should call getLookupListByTypeIdList', async () => {
      const obj = { lookupIds: ['id1', 'id2'] }
      await commonApi.getLookupListByTypeIdList(obj)
      expect(testRequest.post).toHaveBeenCalledWith('lookups', obj)
    })

    it('should call getLicences', async () => {
      await commonApi.getLicences()
      expect(testRequest.get).toHaveBeenCalledWith('/lookups/licenses')
    })

    it('should call getTicket', async () => {
      await commonApi.getTicket()
      expect(testRequest.get).toHaveBeenCalledWith('/reports/ticket')
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      await commonApi.getTimezones()
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for lookup list operations', async () => {
      const obj = { lookupIds: ['id1', 'id2'] }
      await commonApi.getLookupListByTypeIdList(obj)
      expect(testRequest.post).toHaveBeenCalled()
    })
  })

  describe('lookup API patterns', () => {
    it('should handle single lookup ID retrieval', async () => {
      const id = 'status-lookup'
      await commonApi.getLookupListByTypeId(id)
      expect(testRequest.get).toHaveBeenCalledWith(`lookups/${id}`)
    })

    it('should handle multiple lookup ID retrieval', async () => {
      const payload = { lookupIds: ['id1', 'id2', 'id3'] }
      await commonApi.getLookupListByTypeIdList(payload)
      expect(testRequest.post).toHaveBeenCalledWith('lookups', payload)
    })
  })

  describe('edge cases', () => {
    it('should handle lookup ID with special characters', async () => {
      const id = 'lookup-123!@#'
      await commonApi.getLookupListByTypeId(id)
      expect(testRequest.get).toHaveBeenCalledWith(`lookups/${id}`)
    })

    it('should handle empty lookup list', async () => {
      const obj = { lookupIds: [] }
      await commonApi.getLookupListByTypeIdList(obj)
      expect(testRequest.post).toHaveBeenCalledWith('lookups', obj)
    })

    it('should handle large number of lookups', async () => {
      const ids = Array.from({ length: 100 }, (_, i) => `id${i}`)
      const obj = { lookupIds: ids }
      await commonApi.getLookupListByTypeIdList(obj)
      expect(testRequest.post).toHaveBeenCalledWith('lookups', obj)
    })
  })
})
