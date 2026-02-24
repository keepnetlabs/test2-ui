import * as settingsApi from '@/api/settings'
import testRequest from '@/utils/testRequest'

jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} })
}))

describe('settings API (extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getTimezone', () => {
    it('calls GET /timezone/timezones', async () => {
      await settingsApi.getTimezone()
      expect(testRequest.get).toHaveBeenCalledWith('/timezone/timezones')
    })
  })

  describe('getSystemUserSettings', () => {
    it('calls GET /system-users/settings', async () => {
      await settingsApi.getSystemUserSettings()
      expect(testRequest.get).toHaveBeenCalledWith('/system-users/settings')
    })
  })

  describe('setSystemUserSettings', () => {
    it('calls PUT with payload and config', async () => {
      const payload = { timeZoneId: 'UTC' }
      await settingsApi.setSystemUserSettings(payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        '/system-users/settings',
        payload,
        expect.objectContaining({ loading: true })
      )
    })
  })
})
