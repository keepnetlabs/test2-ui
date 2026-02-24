import { postWidgets, getSummary } from '@/api/widgets'
import testRequest from '@/utils/testRequest'

jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} })
}))

describe('widgets API (extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('postWidgets', () => {
    it('calls POST dashboard/widgets with snackbar', async () => {
      await postWidgets({ widgetId: 'w1' })
      expect(testRequest.post).toHaveBeenCalledWith(
        'dashboard/widgets',
        { widgetId: 'w1' },
        expect.objectContaining({ snackbar: expect.anything() })
      )
    })
  })

  describe('getSummary', () => {
    it('calls GET with loading true by default', async () => {
      await getSummary()
      expect(testRequest.get).toHaveBeenCalledWith('/dashboard/summary', { loading: true })
    })
    it('calls GET with loading false when passed', async () => {
      await getSummary({}, false)
      expect(testRequest.get).toHaveBeenCalledWith('/dashboard/summary', {})
    })
    it('calls GET with custom payload', async () => {
      await getSummary({ date: '2024-01-01' })
      expect(testRequest.get).toHaveBeenCalledWith('/dashboard/summary', { loading: true })
    })
  })
})
