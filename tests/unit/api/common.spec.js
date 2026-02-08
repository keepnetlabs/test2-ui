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

  describe('Parameter Handling', () => {
    it('should handle numeric and string type IDs', async () => {
      await CommonAPI.getLookupListByTypeId(123)
      expect(testRequest.get).toHaveBeenCalledWith('lookups/123')

      testRequest.get.mockClear()
      await CommonAPI.getLookupListByTypeId('type-abc')
      expect(testRequest.get).toHaveBeenCalledWith('lookups/type-abc')
    })

    it('should handle empty array in lookup list', async () => {
      const payload = { typeidlist: [] }
      await CommonAPI.getLookupListByTypeIdList(payload)
      expect(testRequest.post).toHaveBeenCalledWith('lookups', payload)
    })

    it('should handle multiple type IDs in array', async () => {
      const payload = { typeidlist: [1, 2, 3, 4, 5] }
      await CommonAPI.getLookupListByTypeIdList(payload)
      expect(testRequest.post).toHaveBeenCalledWith('lookups', payload)
    })

    it('should handle complex lookup payload', async () => {
      const payload = {
        typeidlist: [100, 200, 300],
        filters: { active: true },
        page: 1
      }
      await CommonAPI.getLookupListByTypeIdList(payload)
      expect(testRequest.post).toHaveBeenCalledWith('lookups', payload)
    })
  })

  describe('Edge Cases', () => {
    it('should handle zero as typeId', async () => {
      await CommonAPI.getLookupListByTypeId(0)
      expect(testRequest.get).toHaveBeenCalledWith('lookups/0')
    })

    it('should handle negative numbers as typeId', async () => {
      await CommonAPI.getLookupListByTypeId(-1)
      expect(testRequest.get).toHaveBeenCalledWith('lookups/-1')
    })

    it('should handle special characters in typeId', async () => {
      await CommonAPI.getLookupListByTypeId('id-@-#-$')
      expect(testRequest.get).toHaveBeenCalledWith('lookups/id-@-#-$')
    })

    it('should handle very large arrays', async () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => i)
      const payload = { typeidlist: largeArray }
      await CommonAPI.getLookupListByTypeIdList(payload)
      expect(testRequest.post).toHaveBeenCalledWith('lookups', payload)
    })

    it('should handle response with various data structures', async () => {
      const mockResponse = {
        data: {
          data: [
            { id: 1, label: 'Item 1' },
            { id: 2, label: 'Item 2' }
          ]
        },
        headers: { 'content-type': 'application/json' }
      }
      testRequest.get.mockResolvedValueOnce(mockResponse)

      const result = await CommonAPI.getCountryTimezones()
      expect(result).toEqual(mockResponse)
    })
  })

  describe('Return Value Consistency', () => {
    it('all functions should return thenable objects', () => {
      const results = [
        CommonAPI.getTimezones(),
        CommonAPI.getLicences(),
        CommonAPI.getTicket(),
        CommonAPI.getCountryTimezones(),
        CommonAPI.getLookupListByTypeId(1),
        CommonAPI.getLookupListByTypeIdList({})
      ]

      results.forEach(result => {
        expect(typeof result.then).toBe('function')
      })
    })

    it('all functions should support async/await', async () => {
      const timezone = await CommonAPI.getTimezones()
      const licenses = await CommonAPI.getLicences()
      const ticket = await CommonAPI.getTicket()
      const countryTz = await CommonAPI.getCountryTimezones()
      const lookup = await CommonAPI.getLookupListByTypeId(1)
      const lookupList = await CommonAPI.getLookupListByTypeIdList({})

      expect(timezone).toBeDefined()
      expect(licenses).toBeDefined()
      expect(ticket).toBeDefined()
      expect(countryTz).toBeDefined()
      expect(lookup).toBeDefined()
      expect(lookupList).toBeDefined()
    })
  })

  describe('Error Propagation', () => {
    it('should propagate different error types', async () => {
      const networkError = new Error('Network timeout')
      testRequest.get.mockRejectedValueOnce(networkError)

      await expect(CommonAPI.getTimezones()).rejects.toEqual(networkError)
    })

    it('should handle multiple sequential errors', async () => {
      const error1 = new Error('Error 1')
      const error2 = new Error('Error 2')

      testRequest.get.mockRejectedValueOnce(error1)
      testRequest.post.mockRejectedValueOnce(error2)

      await expect(CommonAPI.getTimezones()).rejects.toThrow('Error 1')
      await expect(CommonAPI.getLookupListByTypeIdList({})).rejects.toThrow('Error 2')
    })

    it('should handle errors in parallel requests', async () => {
      const error = new Error('Parallel error')
      testRequest.get.mockRejectedValueOnce(error)

      try {
        await Promise.all([
          CommonAPI.getTimezones(),
          CommonAPI.getLicences()
        ])
      } catch (e) {
        expect(e.message).toBe('Parallel error')
      }
    })
  })
})
