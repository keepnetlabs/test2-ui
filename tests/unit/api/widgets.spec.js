jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({})
}))

import testRequest from '@/utils/testRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import * as widgetsApi from '@/api/widgets'

describe('widgets API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('widget operations', () => {
    it('should call postWidgets', async () => {
      const payload = { widgetIds: ['widget-1', 'widget-2'] }
      await widgetsApi.postWidgets(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'dashboard/widgets',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call getSummary with default loading', async () => {
      await widgetsApi.getSummary()
      expect(testRequest.get).toHaveBeenCalledWith('/dashboard/summary', { loading: true })
    })

    it('should call getSummary with loading disabled', async () => {
      await widgetsApi.getSummary({}, false)
      expect(testRequest.get).toHaveBeenCalledWith('/dashboard/summary', {})
    })

    it('should call getSummary with payload and loading enabled', async () => {
      const payload = { filters: {} }
      await widgetsApi.getSummary(payload, true)
      expect(testRequest.get).toHaveBeenCalledWith('/dashboard/summary', { loading: true })
    })

    it('should call getSummary with payload and loading disabled', async () => {
      const payload = { filters: {} }
      await widgetsApi.getSummary(payload, false)
      expect(testRequest.get).toHaveBeenCalledWith('/dashboard/summary', {})
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for summary retrieval', async () => {
      await widgetsApi.getSummary()
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for widget updates', async () => {
      const payload = { widgetIds: ['widget-1'] }
      await widgetsApi.postWidgets(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })
  })

  describe('snackbar consistency', () => {
    it('should use COMMON_SNACKBAR for widget operations', async () => {
      const payload = { widgetIds: ['widget-1'] }
      await widgetsApi.postWidgets(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })
  })

  describe('loading indicator', () => {
    it('should enable loading by default', async () => {
      await widgetsApi.getSummary()
      expect(testRequest.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ loading: true })
      )
    })

    it('should disable loading when specified', async () => {
      await widgetsApi.getSummary({}, false)
      expect(testRequest.get).toHaveBeenCalledWith(expect.any(String), {})
    })
  })

  describe('edge cases', () => {
    it('should handle widget operations with empty payload', async () => {
      await widgetsApi.postWidgets({})
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle multiple widget IDs', async () => {
      const payload = { widgetIds: ['widget-1', 'widget-2', 'widget-3'] }
      await widgetsApi.postWidgets(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle summary retrieval with various loading states', async () => {
      await widgetsApi.getSummary({}, true)
      expect(testRequest.get).toHaveBeenCalledWith(
        expect.any(String),
        { loading: true }
      )
    })
  })

  describe('return values', () => {
    it('all functions should return thenables', async () => {
      expect(typeof widgetsApi.postWidgets({}).then).toBe('function')
      expect(typeof widgetsApi.getSummary().then).toBe('function')
    })
  })

  describe('All Exported Functions', () => {
    it('should export 2 functions', () => {
      const functions = Object.values(widgetsApi).filter(x => typeof x === 'function')
      expect(functions.length).toBe(2)
    })

    it('should export specific functions', () => {
      expect(typeof widgetsApi.postWidgets).toBe('function')
      expect(typeof widgetsApi.getSummary).toBe('function')
    })
  })

  describe('Integration Workflows', () => {
    it('should handle dashboard summary workflow', async () => {
      testRequest.get.mockClear()
      await widgetsApi.getSummary()
      expect(testRequest.get).toHaveBeenCalledTimes(1)
      expect(testRequest.get).toHaveBeenCalledWith('/dashboard/summary', { loading: true })
    })

    it('should handle widget update workflow', async () => {
      testRequest.post.mockClear()
      const payload = { widgetIds: ['widget-1', 'widget-2'] }
      await widgetsApi.postWidgets(payload)
      expect(testRequest.post).toHaveBeenCalledTimes(1)
      expect(testRequest.post).toHaveBeenCalledWith(
        'dashboard/widgets',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should handle parallel widget operations', async () => {
      const results = await Promise.all([
        widgetsApi.getSummary(),
        widgetsApi.postWidgets({ widgetIds: ['w1'] })
      ])

      expect(results).toHaveLength(2)
      expect(testRequest.get).toHaveBeenCalledTimes(1)
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle complete widget management flow', async () => {
      testRequest.get.mockClear()
      testRequest.post.mockClear()

      await widgetsApi.getSummary()
      expect(testRequest.get).toHaveBeenCalledTimes(1)

      await widgetsApi.postWidgets({ widgetIds: ['new-widget'] })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      await widgetsApi.getSummary({}, true)
      expect(testRequest.get).toHaveBeenCalledTimes(2)
    })
  })

  describe('Parameter Handling', () => {
    it('should handle default parameters for getSummary', async () => {
      testRequest.get.mockClear()
      await widgetsApi.getSummary()
      expect(testRequest.get).toHaveBeenCalledWith('/dashboard/summary', { loading: true })
    })

    it('should handle explicit loading=true', async () => {
      testRequest.get.mockClear()
      await widgetsApi.getSummary({}, true)
      expect(testRequest.get).toHaveBeenCalledWith('/dashboard/summary', { loading: true })
    })

    it('should handle explicit loading=false', async () => {
      testRequest.get.mockClear()
      await widgetsApi.getSummary({}, false)
      expect(testRequest.get).toHaveBeenCalledWith('/dashboard/summary', {})
    })

    it('should handle payload without loading state', async () => {
      testRequest.get.mockClear()
      const payload = { filters: { type: 'dashboard' } }
      await widgetsApi.getSummary(payload)
      expect(testRequest.get).toHaveBeenCalledWith('/dashboard/summary', { loading: true })
    })

    it('should handle various widget ID formats', async () => {
      const payloads = [
        { widgetIds: ['w1'] },
        { widgetIds: ['widget-1', 'widget-2'] },
        { widgetIds: ['123', '456', '789'] },
        { widgetIds: [] }
      ]

      for (const payload of payloads) {
        testRequest.post.mockClear()
        await widgetsApi.postWidgets(payload)
        expect(testRequest.post).toHaveBeenCalledWith(
          'dashboard/widgets',
          payload,
          { snackbar: COMMON_SNACKBAR }
        )
      }
    })

    it('should handle complex widget configuration', async () => {
      const payload = {
        widgetIds: ['w1', 'w2', 'w3'],
        config: {
          theme: 'dark',
          layout: 'grid',
          size: 'large'
        }
      }

      await widgetsApi.postWidgets(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'dashboard/widgets',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('Error Handling', () => {
    it('should propagate getSummary errors', async () => {
      const error = new Error('Summary retrieval failed')
      testRequest.get.mockRejectedValueOnce(error)

      await expect(widgetsApi.getSummary()).rejects.toThrow('Summary retrieval failed')
    })

    it('should propagate postWidgets errors', async () => {
      const error = new Error('Widget update failed')
      testRequest.post.mockRejectedValueOnce(error)

      await expect(widgetsApi.postWidgets({})).rejects.toThrow('Widget update failed')
    })

    it('should handle errors with various loading states', async () => {
      const error = new Error('Load error')
      testRequest.get.mockRejectedValueOnce(error)

      await expect(widgetsApi.getSummary({}, true)).rejects.toThrow('Load error')
    })

    it('should handle multiple sequential errors', async () => {
      testRequest.get.mockRejectedValueOnce(new Error('Error 1'))
      testRequest.post.mockRejectedValueOnce(new Error('Error 2'))

      await expect(widgetsApi.getSummary()).rejects.toThrow('Error 1')
      await expect(widgetsApi.postWidgets({})).rejects.toThrow('Error 2')
    })
  })

  describe('API Endpoint URLs', () => {
    it('should call correct endpoint for summary', async () => {
      testRequest.get.mockClear()
      await widgetsApi.getSummary()
      const calls = testRequest.get.mock.calls
      expect(calls[0][0]).toBe('/dashboard/summary')
    })

    it('should call correct endpoint for widget updates', async () => {
      testRequest.post.mockClear()
      await widgetsApi.postWidgets({ widgetIds: [] })
      const calls = testRequest.post.mock.calls
      expect(calls[0][0]).toBe('dashboard/widgets')
    })

    it('should use consistent endpoint format', async () => {
      testRequest.get.mockClear()
      testRequest.post.mockClear()

      await widgetsApi.getSummary()
      await widgetsApi.postWidgets({ widgetIds: [] })

      expect(testRequest.get).toHaveBeenCalledWith('/dashboard/summary', expect.any(Object))
      expect(testRequest.post).toHaveBeenCalledWith('dashboard/widgets', expect.any(Object), expect.any(Object))
    })
  })

  describe('Request Configuration', () => {
    it('should include snackbar config in POST requests', async () => {
      testRequest.post.mockClear()
      await widgetsApi.postWidgets({ widgetIds: ['w1'] })

      const calls = testRequest.post.mock.calls
      const config = calls[0][2]
      expect(config).toHaveProperty('snackbar')
      expect(config.snackbar).toBe(COMMON_SNACKBAR)
    })

    it('should configure loading state for GET requests', async () => {
      testRequest.get.mockClear()
      await widgetsApi.getSummary()

      const calls = testRequest.get.mock.calls
      const config = calls[0][1]
      expect(config).toHaveProperty('loading')
    })

    it('should allow disabling loading indicator', async () => {
      testRequest.get.mockClear()
      await widgetsApi.getSummary({}, false)

      const calls = testRequest.get.mock.calls
      const config = calls[0][1]
      expect(config.loading).toBeUndefined()
    })
  })

  describe('Function Behavior', () => {
    it('postWidgets should always include snackbar', async () => {
      const payloads = [
        { widgetIds: [] },
        { widgetIds: ['w1'] },
        { widgetIds: ['w1', 'w2', 'w3'] }
      ]

      for (const payload of payloads) {
        testRequest.post.mockClear()
        await widgetsApi.postWidgets(payload)
        expect(testRequest.post).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(Object),
          expect.objectContaining({ snackbar: COMMON_SNACKBAR })
        )
      }
    })

    it('getSummary should handle optional parameters', async () => {
      testRequest.get.mockClear()
      await widgetsApi.getSummary()
      await widgetsApi.getSummary({})
      await widgetsApi.getSummary({}, true)
      await widgetsApi.getSummary({}, false)

      expect(testRequest.get).toHaveBeenCalledTimes(4)
    })

    it('getSummary with no loading state should default to true', async () => {
      testRequest.get.mockClear()
      await widgetsApi.getSummary()

      const config = testRequest.get.mock.calls[0][1]
      expect(config.loading).toBe(true)
    })
  })

  describe('Async Behavior', () => {
    it('should return Promise-like from postWidgets', async () => {
      const result = widgetsApi.postWidgets({})
      expect(typeof result.then).toBe('function')
      await result
    })

    it('should return Promise-like from getSummary', async () => {
      const result = widgetsApi.getSummary()
      expect(typeof result.then).toBe('function')
      await result
    })

    it('should handle async/await syntax', async () => {
      expect(async () => {
        await widgetsApi.getSummary()
        await widgetsApi.postWidgets({})
      }).toBeDefined()
    })

    it('should support Promise.all for parallel operations', async () => {
      const promises = [
        widgetsApi.getSummary(),
        widgetsApi.postWidgets({ widgetIds: ['w1'] })
      ]

      const results = await Promise.all(promises)
      expect(results).toHaveLength(2)
    })
  })

  describe('Mock Verification', () => {
    it('should verify test utilities are mocked', () => {
      expect(testRequest).toBeDefined()
      expect(testRequest.get).toBeDefined()
      expect(testRequest.post).toBeDefined()
    })

    it('should verify mocked functions are callable', () => {
      expect(typeof testRequest.get).toBe('function')
      expect(typeof testRequest.post).toBe('function')
    })

    it('should verify COMMON_SNACKBAR is available', () => {
      expect(COMMON_SNACKBAR).toBeDefined()
    })

    it('should verify API functions are exported', () => {
      expect(widgetsApi.getSummary).toBeDefined()
      expect(widgetsApi.postWidgets).toBeDefined()
    })
  })

  describe('State Isolation', () => {
    it('should not affect other calls with different parameters', async () => {
      testRequest.get.mockClear()

      await widgetsApi.getSummary({}, true)
      await widgetsApi.getSummary({}, false)

      expect(testRequest.get).toHaveBeenCalledTimes(2)
      const call1Config = testRequest.get.mock.calls[0][1]
      const call2Config = testRequest.get.mock.calls[1][1]

      expect(call1Config.loading).toBe(true)
      expect(call2Config.loading).toBeUndefined()
    })

    it('should handle widget updates without affecting summary calls', async () => {
      testRequest.get.mockClear()
      testRequest.post.mockClear()

      await widgetsApi.postWidgets({ widgetIds: ['w1'] })
      await widgetsApi.getSummary()

      expect(testRequest.post).toHaveBeenCalledTimes(1)
      expect(testRequest.get).toHaveBeenCalledTimes(1)
    })
  })
})
