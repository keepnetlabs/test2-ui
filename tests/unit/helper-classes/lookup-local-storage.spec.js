import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import * as commonApi from '@/api/common'

jest.mock('@/api/common')

describe('LookupLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('getStore', () => {
    it('should return empty object when localStorage is empty', () => {
      const store = LookupLocalStorage.getStore()
      expect(store).toEqual({})
    })

    it('should parse and return stored object from localStorage', () => {
      const testData = { 1: [{ id: 1, name: 'Item 1' }] }
      localStorage.setItem('lookupLocalStorageStore', JSON.stringify(testData))

      const store = LookupLocalStorage.getStore()
      expect(store).toEqual(testData)
    })

    it('should handle malformed JSON gracefully', () => {
      localStorage.setItem('lookupLocalStorageStore', 'invalid json')
      // This will throw an error in JSON.parse
      expect(() => {
        LookupLocalStorage.getStore()
      }).toThrow()
    })

    it('should return parsed object when string is stored', () => {
      const testData = { 2: [{ id: 2, name: 'Item 2' }] }
      localStorage.setItem('lookupLocalStorageStore', JSON.stringify(testData))

      const store = LookupLocalStorage.getStore()
      expect(typeof store).toBe('object')
      expect(store['2']).toBeDefined()
    })
  })

  describe('checkCache', () => {
    it('should return false when no lastValidTime provided', () => {
      const result = LookupLocalStorage.checkCache(null)
      expect(result).toBe(false)
    })

    it('should return false when lastValidTime is undefined', () => {
      const result = LookupLocalStorage.checkCache(undefined)
      expect(result).toBe(false)
    })

    it('should return true when lastValidTime is in the future', () => {
      const futureTime = Math.floor(Date.now() / 1000) + 3600 // 1 hour in the future
      const result = LookupLocalStorage.checkCache(futureTime.toString())
      expect(result).toBe(true)
    })

    it('should return false when lastValidTime is in the past', () => {
      const pastTime = Math.floor(Date.now() / 1000) - 3600 // 1 hour in the past
      const result = LookupLocalStorage.checkCache(pastTime.toString())
      expect(result).toBe(false)
    })

    it('should handle numeric lastValidTime values', () => {
      const futureTime = Math.floor(Date.now() / 1000) + 1000
      const result = LookupLocalStorage.checkCache(futureTime)
      expect(result).toBe(true)
    })

    it('should return false when lastValidTime equals current time', () => {
      const now = Math.floor(Date.now() / 1000)
      const result = LookupLocalStorage.checkCache(now.toString())
      expect(result).toBe(false) // not greater than
    })
  })

  describe('setTypeIdsToData', () => {
    it('should store data for a single typeId', () => {
      const data = [{ id: 1, name: 'Test' }]
      LookupLocalStorage.setTypeIdsToData(1, data)

      const store = LookupLocalStorage.getStore()
      expect(store['1']).toEqual(data)
    })

    it('should store multiple typeIds separately', () => {
      const data1 = [{ id: 1, name: 'Data 1' }]
      const data2 = [{ id: 2, name: 'Data 2' }]

      LookupLocalStorage.setTypeIdsToData(1, data1)
      LookupLocalStorage.setTypeIdsToData(2, data2)

      const store = LookupLocalStorage.getStore()
      expect(store['1']).toEqual(data1)
      expect(store['2']).toEqual(data2)
    })

    it('should overwrite existing data for same typeId', () => {
      const data1 = [{ id: 1, name: 'Old' }]
      const data2 = [{ id: 1, name: 'New' }]

      LookupLocalStorage.setTypeIdsToData(1, data1)
      LookupLocalStorage.setTypeIdsToData(1, data2)

      const store = LookupLocalStorage.getStore()
      expect(store['1']).toEqual(data2)
    })

    it('should convert numeric typeId to string key', () => {
      const data = [{ id: 1 }]
      LookupLocalStorage.setTypeIdsToData(10, data)

      const store = LookupLocalStorage.getStore()
      expect(store['10']).toEqual(data)
    })
  })

  describe('deleteCachedItems', () => {
    it('should delete single-char keys when isMultiple is false', () => {
      const store = { '1': [{ id: 1 }], '2': [{ id: 2 }], '1,2': [{ id: 3 }] }
      LookupLocalStorage.deleteCachedItems(store, false)

      expect(store['1']).toBeUndefined()
      expect(store['2']).toBeUndefined()
      expect(store['1,2']).toBeDefined()
    })

    it('should delete multi-char keys when isMultiple is true', () => {
      const store = { '1': [{ id: 1 }], '2': [{ id: 2 }], '1,2': [{ id: 3 }] }
      LookupLocalStorage.deleteCachedItems(store, true)

      expect(store['1']).toBeDefined()
      expect(store['2']).toBeDefined()
      expect(store['1,2']).toBeUndefined()
    })

    it('should update localStorage after deletion', () => {
      const store = { '1': [{ id: 1 }], '1,2': [{ id: 2 }] }
      LookupLocalStorage.deleteCachedItems(store, false)

      const savedStore = LookupLocalStorage.getStore()
      expect(savedStore['1']).toBeUndefined()
      expect(savedStore['1,2']).toBeDefined()
    })

    it('should handle empty store', () => {
      const store = {}
      expect(() => {
        LookupLocalStorage.deleteCachedItems(store, false)
      }).not.toThrow()
    })

    it('should handle store with mixed key lengths', () => {
      const store = {
        '1': [{ id: 1 }],
        '2': [{ id: 2 }],
        '1,2': [{ id: 3 }],
        '1,2,3': [{ id: 4 }],
        'a': [{ id: 5 }]
      }

      LookupLocalStorage.deleteCachedItems(store, false)

      expect(store['1']).toBeUndefined()
      expect(store['1,2']).toBeDefined()
      expect(store['1,2,3']).toBeDefined()
    })
  })

  describe('setCacheTime', () => {
    it('should set cache time when lookup-expire header exists', () => {
      const headers = { 'lookup-expire': '1234567890' }
      LookupLocalStorage.setCacheTime('testType', headers)

      const stored = localStorage.getItem('testType')
      expect(stored).toBe('1234567890')
    })

    it('should not set cache time when lookup-expire header missing', () => {
      const headers = {}
      LookupLocalStorage.setCacheTime('testType', headers)

      const stored = localStorage.getItem('testType')
      expect(stored).toBeNull()
    })

    it('should overwrite existing cache time', () => {
      localStorage.setItem('testType', 'old-value')
      const headers = { 'lookup-expire': 'new-value' }

      LookupLocalStorage.setCacheTime('testType', headers)

      const stored = localStorage.getItem('testType')
      expect(stored).toBe('new-value')
    })
  })

  describe('getSingle', () => {
    it('should return cached value if cache is valid and value exists', async () => {
      const futureTime = Math.floor(Date.now() / 1000) + 3600
      localStorage.setItem('lookupLastValidTimeSingle', futureTime.toString())
      const testData = [{ id: 1, name: 'Test' }]
      LookupLocalStorage.setTypeIdsToData(1, testData)

      const result = await LookupLocalStorage.getSingle(1)

      expect(result).toEqual(testData)
      expect(commonApi.getLookupListByTypeId).not.toHaveBeenCalled()
    })

    it('should call API when cache is invalid', async () => {
      const apiResponse = { data: { data: [{ id: 1, name: 'API Data' }] }, headers: {} }
      commonApi.getLookupListByTypeId.mockResolvedValue(apiResponse)

      const result = await LookupLocalStorage.getSingle(1)

      expect(commonApi.getLookupListByTypeId).toHaveBeenCalledWith(1)
      expect(result).toBeDefined()
    })

    it('should call API when value is not in cache', async () => {
      const futureTime = Math.floor(Date.now() / 1000) + 3600
      localStorage.setItem('lookupLastValidTimeSingle', futureTime.toString())

      const apiResponse = { data: { data: [{ id: 2, name: 'New Data' }] }, headers: {} }
      commonApi.getLookupListByTypeId.mockResolvedValue(apiResponse)

      const result = await LookupLocalStorage.getSingle(2)

      expect(commonApi.getLookupListByTypeId).toHaveBeenCalledWith(2)
      expect(result).toEqual([{ id: 2, name: 'New Data' }])
    })

    it('should delete cached items when cache is invalid', async () => {
      LookupLocalStorage.setTypeIdsToData(1, [{ id: 1, old: true }])
      LookupLocalStorage.setTypeIdsToData('1,2', [{ id: 2 }])

      const apiResponse = {
        data: { data: [{ id: 1, new: true }] },
        headers: { 'lookup-expire': '9999999999' }
      }
      commonApi.getLookupListByTypeId.mockResolvedValue(apiResponse)

      const result = await LookupLocalStorage.getSingle(1)

      // Should return new data from API
      expect(result[0].new).toBe(true)

      const store = LookupLocalStorage.getStore()
      expect(store['1']).toBeDefined() // Single key re-added with new data
      expect(store['1,2']).toBeDefined() // Multiple keys should remain
    }, 10000)

    it('should set cache time from response headers', async () => {
      const apiResponse = {
        data: { data: [{ id: 1 }] },
        headers: { 'lookup-expire': '9999999999' }
      }
      commonApi.getLookupListByTypeId.mockResolvedValue(apiResponse)

      await LookupLocalStorage.getSingle(1)

      const cacheTime = localStorage.getItem('lookupLastValidTimeSingle')
      expect(cacheTime).toBe('9999999999')
    })

    it('should handle API response with empty data', async () => {
      const apiResponse = { data: {}, headers: {} }
      commonApi.getLookupListByTypeId.mockResolvedValue(apiResponse)

      const result = await LookupLocalStorage.getSingle(1)

      expect(result).toBeDefined()
      expect(result).toEqual([])
    })
  })

  describe('getMultiple', () => {
    it('should return cached value if cache is valid and values exist', async () => {
      const futureTime = Math.floor(Date.now() / 1000) + 3600
      localStorage.setItem('lookupLastValidTimeMultiple', futureTime.toString())
      const testData = [{ id: 1 }, { id: 2 }]
      LookupLocalStorage.setTypeIdsToData('1,2', testData)

      const result = await LookupLocalStorage.getMultiple([1, 2])

      expect(result).toEqual(testData)
      expect(commonApi.getLookupListByTypeIdList).not.toHaveBeenCalled()
    })

    it('should call API when cache is invalid', async () => {
      const apiResponse = {
        data: { data: [{ id: 1 }, { id: 2 }] },
        headers: {}
      }
      commonApi.getLookupListByTypeIdList.mockResolvedValue(apiResponse)

      const result = await LookupLocalStorage.getMultiple([1, 2])

      expect(commonApi.getLookupListByTypeIdList).toHaveBeenCalledWith({ typeidlist: [1, 2] })
      expect(result).toBeDefined()
    })

    it('should call API when values not in cache', async () => {
      const futureTime = Math.floor(Date.now() / 1000) + 3600
      localStorage.setItem('lookupLastValidTimeMultiple', futureTime.toString())

      const apiResponse = {
        data: { data: [{ id: 3 }, { id: 4 }] },
        headers: {}
      }
      commonApi.getLookupListByTypeIdList.mockResolvedValue(apiResponse)

      const result = await LookupLocalStorage.getMultiple([3, 4])

      expect(commonApi.getLookupListByTypeIdList).toHaveBeenCalledWith({ typeidlist: [3, 4] })
      expect(result).toBeDefined()
    })

    it('should join typeIds with comma', async () => {
      const apiResponse = {
        data: { data: [{ id: 1 }, { id: 2 }, { id: 3 }] },
        headers: {}
      }
      commonApi.getLookupListByTypeIdList.mockResolvedValue(apiResponse)

      await LookupLocalStorage.getMultiple([1, 2, 3])

      const store = LookupLocalStorage.getStore()
      expect(store['1,2,3']).toBeDefined()
    })

    it('should delete multi-char keys when cache is invalid', async () => {
      LookupLocalStorage.setTypeIdsToData('1,2', [{ id: 1, old: true }])
      LookupLocalStorage.setTypeIdsToData(3, [{ id: 3 }])

      const apiResponse = {
        data: { data: [{ id: 1, new: true }, { id: 2 }] },
        headers: { 'lookup-expire': '9999999999' }
      }
      commonApi.getLookupListByTypeIdList.mockResolvedValue(apiResponse)

      const result = await LookupLocalStorage.getMultiple([1, 2])

      // Should return new data from API
      expect(result[0].new).toBe(true)

      const store = LookupLocalStorage.getStore()
      expect(store['1,2']).toBeDefined() // Multi-char key re-added with new data
      expect(store['3']).toBeDefined() // Single key should remain
    }, 10000)

    it('should handle empty typeIds array', async () => {
      const apiResponse = { data: { data: [] }, headers: {} }
      commonApi.getLookupListByTypeIdList.mockResolvedValue(apiResponse)

      const result = await LookupLocalStorage.getMultiple([])

      expect(commonApi.getLookupListByTypeIdList).toHaveBeenCalledWith({ typeidlist: [] })
    })
  })

  describe('callApiByTypeId', () => {
    it('should fetch and cache data for a typeId', async () => {
      const apiResponse = {
        data: { data: [{ id: 1, name: 'Test' }] },
        headers: { 'lookup-expire': '9999999999' }
      }
      commonApi.getLookupListByTypeId.mockResolvedValue(apiResponse)

      const result = await LookupLocalStorage.callApiByTypeId(1)

      expect(result).toEqual([{ id: 1, name: 'Test' }])
      expect(LookupLocalStorage.getStore()['1']).toBeDefined()
    })

    it('should set cache time from API response', async () => {
      const apiResponse = {
        data: { data: [] },
        headers: { 'lookup-expire': '1234567890' }
      }
      commonApi.getLookupListByTypeId.mockResolvedValue(apiResponse)

      await LookupLocalStorage.callApiByTypeId(1)

      const cacheTime = localStorage.getItem('lookupLastValidTimeSingle')
      expect(cacheTime).toBe('1234567890')
    })

    it('should handle default empty data in response', async () => {
      const apiResponse = { data: {}, headers: {} }
      commonApi.getLookupListByTypeId.mockResolvedValue(apiResponse)

      const result = await LookupLocalStorage.callApiByTypeId(1)

      expect(result).toBeDefined()
      expect(result).toEqual([])
    })
  })

  describe('callApiByTypeListId', () => {
    it('should fetch and cache data for multiple typeIds', async () => {
      const apiResponse = {
        data: { data: [{ id: 1 }, { id: 2 }] },
        headers: { 'lookup-expire': '9999999999' }
      }
      commonApi.getLookupListByTypeIdList.mockResolvedValue(apiResponse)

      const result = await LookupLocalStorage.callApiByTypeListId([1, 2])

      expect(result).toEqual([{ id: 1 }, { id: 2 }])
      expect(LookupLocalStorage.getStore()['1,2']).toBeDefined()
    })

    it('should set cache time from API response', async () => {
      const apiResponse = {
        data: { data: [] },
        headers: { 'lookup-expire': '1234567890' }
      }
      commonApi.getLookupListByTypeIdList.mockResolvedValue(apiResponse)

      await LookupLocalStorage.callApiByTypeListId([1, 2])

      const cacheTime = localStorage.getItem('lookupLastValidTimeMultiple')
      expect(cacheTime).toBe('1234567890')
    })

    it('should handle default empty data in response', async () => {
      const apiResponse = { data: {}, headers: {} }
      commonApi.getLookupListByTypeIdList.mockResolvedValue(apiResponse)

      const result = await LookupLocalStorage.callApiByTypeListId([1, 2])

      expect(result).toBeDefined()
      expect(result).toEqual([])
    })
  })

  describe('integration scenarios', () => {
    it('should cache single lookup and use it on subsequent calls', async () => {
      const apiResponse = {
        data: { data: [{ id: 1, name: 'Item 1' }] },
        headers: { 'lookup-expire': Math.floor(Date.now() / 1000) + 3600 }
      }
      commonApi.getLookupListByTypeId.mockResolvedValue(apiResponse)

      // First call - from API
      const result1 = await LookupLocalStorage.getSingle(1)
      expect(commonApi.getLookupListByTypeId).toHaveBeenCalledTimes(1)

      // Second call - from cache
      const result2 = await LookupLocalStorage.getSingle(1)
      expect(commonApi.getLookupListByTypeId).toHaveBeenCalledTimes(1) // Not called again
      expect(result1).toEqual(result2)
    })

    it('should handle mixed single and multiple lookups', async () => {
      const singleResponse = {
        data: { data: [{ id: 1 }] },
        headers: { 'lookup-expire': Math.floor(Date.now() / 1000) + 3600 }
      }
      const multipleResponse = {
        data: { data: [{ id: 2 }, { id: 3 }] },
        headers: { 'lookup-expire': Math.floor(Date.now() / 1000) + 3600 }
      }

      commonApi.getLookupListByTypeId.mockResolvedValue(singleResponse)
      commonApi.getLookupListByTypeIdList.mockResolvedValue(multipleResponse)

      await LookupLocalStorage.getSingle(1)
      await LookupLocalStorage.getMultiple([2, 3])

      const store = LookupLocalStorage.getStore()
      expect(store['1']).toBeDefined()
      expect(store['2,3']).toBeDefined()
    })
  })
})
