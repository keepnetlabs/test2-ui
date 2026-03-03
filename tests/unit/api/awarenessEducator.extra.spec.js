jest.mock('@/utils/testRequest', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
}))

import testRequest from '@/utils/testRequest'
import awarenessApi from '@/api/awarenessEducator'

describe('awarenessEducator API (extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('searchTraining error handling', () => {
    it('searchTraining propagates rejection', async () => {
      const error = new Error('Network error')
      testRequest.post.mockRejectedValue(error)

      await expect(awarenessApi.searchTraining({})).rejects.toThrow('Network error')
      expect(testRequest.post).toHaveBeenCalledWith('/trainings/search', {}, {})
    })

    it('searchTraining returns thenable', () => {
      testRequest.post.mockResolvedValue({ data: {} })
      const result = awarenessApi.searchTraining({ page: 1 })
      expect(result).toHaveProperty('then')
      expect(result).toHaveProperty('catch')
    })
  })

  describe('getTraining error handling', () => {
    it('getTraining propagates rejection', async () => {
      const error = new Error('Not found')
      testRequest.get.mockRejectedValue(error)

      await expect(awarenessApi.getTraining('id-123')).rejects.toThrow('Not found')
      expect(testRequest.get).toHaveBeenCalledWith('/trainings/id-123')
    })
  })

  describe('createTraining error handling', () => {
    it('createTraining propagates rejection', async () => {
      const error = new Error('Validation failed')
      testRequest.post.mockRejectedValue(error)

      await expect(awarenessApi.createTraining({ name: 'Test' })).rejects.toThrow('Validation failed')
    })
  })
})
