import * as CommonAPI from '@/api/common'
import testRequest from '@/utils/testRequest'

jest.mock('@/utils/testRequest', () => ({
  post: jest.fn().mockResolvedValue({ data: { data: [] }, headers: {} }),
  get: jest.fn().mockResolvedValue({ data: { data: [] }, headers: {} })
}))

describe('Common API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getTimezones', () => {
    it('should call GET endpoint', async () => {
      await CommonAPI.getTimezones()
      expect(testRequest.get).toHaveBeenCalledWith('/timezone/timezones')
    })

    it('should return thenable/promise-like object', () => {
      const result = CommonAPI.getTimezones()
      expect(result).toBeDefined()
      expect(typeof result.then).toBe('function')
    })

    it('should resolve with data', async () => {
      const mockData = { data: { timezones: [] } }
      testRequest.get.mockResolvedValueOnce(mockData)

      const result = await CommonAPI.getTimezones()
      expect(result).toEqual(mockData)
    })

    it('should not be called with parameters', async () => {
      await CommonAPI.getTimezones()
      expect(testRequest.get).toHaveBeenCalledWith('/timezone/timezones')
      expect(testRequest.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('getLookupListByTypeId', () => {
    it('should call GET with typeId parameter', async () => {
      const typeId = 123
      await CommonAPI.getLookupListByTypeId(typeId)
      expect(testRequest.get).toHaveBeenCalledWith(`lookups/${typeId}`)
    })

    it('should handle string typeId', async () => {
      const typeId = 'string-id'
      await CommonAPI.getLookupListByTypeId(typeId)
      expect(testRequest.get).toHaveBeenCalledWith(`lookups/${typeId}`)
    })

    it('should handle numeric typeId', async () => {
      const typeId = 456
      await CommonAPI.getLookupListByTypeId(typeId)
      expect(testRequest.get).toHaveBeenCalledWith(`lookups/${456}`)
    })

    it('should return promise', () => {
      const result = CommonAPI.getLookupListByTypeId(1)
      expect(typeof result.then).toBe("function")
    })

    it('should handle undefined typeId', async () => {
      await CommonAPI.getLookupListByTypeId(undefined)
      expect(testRequest.get).toHaveBeenCalledWith('lookups/undefined')
    })
  })

  describe('getLookupListByTypeIdList', () => {
    it('should call POST with object parameter', async () => {
      const obj = { typeidlist: [1, 2, 3] }
      await CommonAPI.getLookupListByTypeIdList(obj)
      expect(testRequest.post).toHaveBeenCalledWith('lookups', obj)
    })

    it('should use POST method not GET', async () => {
      const obj = { typeidlist: [1] }
      await CommonAPI.getLookupListByTypeIdList(obj)
      expect(testRequest.post).toHaveBeenCalled()
      expect(testRequest.get).not.toHaveBeenCalled()
    })

    it('should pass payload correctly', async () => {
      const payload = { typeidlist: [10, 20, 30], extra: 'data' }
      await CommonAPI.getLookupListByTypeIdList(payload)
      expect(testRequest.post).toHaveBeenCalledWith('lookups', payload)
    })

    it('should handle empty array', async () => {
      const obj = { typeidlist: [] }
      await CommonAPI.getLookupListByTypeIdList(obj)
      expect(testRequest.post).toHaveBeenCalledWith('lookups', obj)
    })

    it('should return promise', () => {
      const result = CommonAPI.getLookupListByTypeIdList({})
      expect(typeof result.then).toBe("function")
    })
  })

  describe('getLicences', () => {
    it('should call GET endpoint', async () => {
      await CommonAPI.getLicences()
      expect(testRequest.get).toHaveBeenCalledWith('/lookups/licenses')
    })

    it('should return promise', () => {
      const result = CommonAPI.getLicences()
      expect(typeof result.then).toBe("function")
    })

    it('should not accept parameters', async () => {
      await CommonAPI.getLicences()
      expect(testRequest.get).toHaveBeenCalledWith('/lookups/licenses')
    })

    it('should resolve with license data', async () => {
      const mockLicenses = { data: { licenses: ['license1', 'license2'] } }
      testRequest.get.mockResolvedValueOnce(mockLicenses)

      const result = await CommonAPI.getLicences()
      expect(result).toEqual(mockLicenses)
    })
  })

  describe('getTicket', () => {
    it('should call GET endpoint', async () => {
      await CommonAPI.getTicket()
      expect(testRequest.get).toHaveBeenCalledWith('/reports/ticket')
    })

    it('should return promise', () => {
      const result = CommonAPI.getTicket()
      expect(typeof result.then).toBe("function")
    })

    it('should not require parameters', async () => {
      await CommonAPI.getTicket()
      expect(testRequest.get).toHaveBeenCalledWith('/reports/ticket')
    })

    it('should resolve with ticket data', async () => {
      const mockTicket = { data: { ticketId: 'ABC123' } }
      testRequest.get.mockResolvedValueOnce(mockTicket)

      const result = await CommonAPI.getTicket()
      expect(result).toEqual(mockTicket)
    })
  })

  describe('getCountryTimezones', () => {
    it('should call GET endpoint', async () => {
      await CommonAPI.getCountryTimezones()
      expect(testRequest.get).toHaveBeenCalledWith('/lookups/country-timezones')
    })

    it('should return promise', () => {
      const result = CommonAPI.getCountryTimezones()
      expect(typeof result.then).toBe("function")
    })

    it('should not accept parameters', async () => {
      await CommonAPI.getCountryTimezones()
      expect(testRequest.get).toHaveBeenCalledWith('/lookups/country-timezones')
    })

    it('should resolve with timezone data', async () => {
      const mockData = { data: { timezones: {} } }
      testRequest.get.mockResolvedValueOnce(mockData)

      const result = await CommonAPI.getCountryTimezones()
      expect(result).toEqual(mockData)
    })
  })

  describe('HTTP Method Consistency', () => {
    it('should use GET for read-only operations', async () => {
      await CommonAPI.getTimezones()
      await CommonAPI.getLicences()
      await CommonAPI.getTicket()
      await CommonAPI.getCountryTimezones()
      await CommonAPI.getLookupListByTypeId(1)

      expect(testRequest.get).toHaveBeenCalledTimes(5)
    })

    it('should use POST for write operations', async () => {
      await CommonAPI.getLookupListByTypeIdList({ typeidlist: [1] })

      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should not mix GET and POST incorrectly', async () => {
      testRequest.get.mockClear()
      testRequest.post.mockClear()

      await CommonAPI.getLookupListByTypeIdList({ data: 'test' })

      expect(testRequest.post).toHaveBeenCalled()
      expect(testRequest.get).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should propagate errors from GET requests', async () => {
      const error = new Error('Network error')
      testRequest.get.mockRejectedValueOnce(error)

      await expect(CommonAPI.getTimezones()).rejects.toThrow('Network error')
    })

    it('should propagate errors from POST requests', async () => {
      const error = new Error('Server error')
      testRequest.post.mockRejectedValueOnce(error)

      await expect(
        CommonAPI.getLookupListByTypeIdList({ test: true })
      ).rejects.toThrow('Server error')
    })
  })

  describe('All Exported Functions', () => {
    it('should export 6 functions', () => {
      const functions = Object.values(CommonAPI).filter(x => typeof x === 'function')
      expect(functions).toHaveLength(6)
    })

    it('should have getTimezones', () => {
      expect(typeof CommonAPI.getTimezones).toBe('function')
    })

    it('should have getLookupListByTypeId', () => {
      expect(typeof CommonAPI.getLookupListByTypeId).toBe('function')
    })

    it('should have getLookupListByTypeIdList', () => {
      expect(typeof CommonAPI.getLookupListByTypeIdList).toBe('function')
    })

    it('should have getLicences', () => {
      expect(typeof CommonAPI.getLicences).toBe('function')
    })

    it('should have getTicket', () => {
      expect(typeof CommonAPI.getTicket).toBe('function')
    })

    it('should have getCountryTimezones', () => {
      expect(typeof CommonAPI.getCountryTimezones).toBe('function')
    })
  })

  describe('Integration Scenarios', () => {
    it('should handle multiple sequential calls', async () => {
      await CommonAPI.getTimezones()
      await CommonAPI.getLicences()
      await CommonAPI.getCountryTimezones()

      expect(testRequest.get).toHaveBeenCalledTimes(3)
    })

    it('should handle mixed GET and POST calls', async () => {
      await CommonAPI.getTimezones()
      await CommonAPI.getLookupListByTypeIdList({ test: 1 })
      await CommonAPI.getLicences()

      expect(testRequest.get).toHaveBeenCalledTimes(2)
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel requests', async () => {
      const results = await Promise.all([
        CommonAPI.getTimezones(),
        CommonAPI.getLicences(),
        CommonAPI.getCountryTimezones()
      ])

      expect(results).toHaveLength(3)
      expect(testRequest.get).toHaveBeenCalledTimes(3)
    })
  })
})
