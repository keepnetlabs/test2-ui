jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockReturnValue(Promise.resolve({})),
  post: jest.fn().mockReturnValue(Promise.resolve({}))
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
})
