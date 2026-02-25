jest.mock('@/utils/emailThreatSimulatorRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  put: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({})
}))

import emailThreatSimulatorRequest from '@/utils/emailThreatSimulatorRequest'
import { getQuickScanList } from '@/api/emailThreatSimlator'

describe('emailThreatSimlator API naming parity', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.APP_CONFIG = { VUE_APP_API_KEY: 'test-api-key' }
    localStorage.getItem = jest.fn(() => 'test-company-id')
  })

  it('getQuickScanList calls request with expected headers', async () => {
    await getQuickScanList({ page: 1 })
    expect(emailThreatSimulatorRequest.post).toHaveBeenCalledWith(
      '/quick-scan/search',
      { page: 1 },
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-IR-API-KEY': 'test-api-key',
          'X-IR-COMPANY-ID': 'test-company-id'
        })
      })
    )
  })
})
