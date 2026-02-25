jest.mock('@/api/settings', () => ({
  getSystemUserSettings: jest.fn()
}))

import App from '@/App.vue'
import { getSystemUserSettings } from '@/api/settings'

describe('App.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('created dispatches whitelabel action', () => {
    const dispatch = jest.fn()
    App.created.call({ $store: { dispatch } })
    expect(dispatch).toHaveBeenCalledWith('login/getWhiteLabelByUrl')
  })

  it('user watcher calls getSystemUserSettings when user is not empty', () => {
    const getSystemUserSettingsMethod = jest.fn()
    App.watch.user.handler.call({ getSystemUserSettings: getSystemUserSettingsMethod }, { id: 1 })
    expect(getSystemUserSettingsMethod).toHaveBeenCalled()
  })

  it('getSystemUserSettings commits formats and timezone values', async () => {
    const setItemSpy = jest.fn()
    localStorage.setItem = setItemSpy
    getSystemUserSettings.mockResolvedValueOnce({
      data: {
        data: {
          dateFormat: 'DD/MM/YYYY',
          timeFormat: 'HH:mm',
          timeZoneId: 'UTC',
          timeZoneName: 'UTC'
        }
      }
    })
    const commit = jest.fn()
    const ctx = { $store: { commit } }

    App.methods.getSystemUserSettings.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(setItemSpy).toHaveBeenCalledWith('selectedDateFormat', 'DD/MM/YYYY')
    expect(setItemSpy).toHaveBeenCalledWith('selectedTimeFormat', 'HH:mm')
    expect(commit).toHaveBeenCalledWith('auth/SET_FORMATS', {
      dateFormat: 'DD/MM/YYYY',
      timeFormat: 'HH:mm'
    })
    expect(commit).toHaveBeenCalledWith('common/SET_SELECTED_TIME_ZONE', 'UTC')
    expect(commit).toHaveBeenCalledWith('common/SET_SELECTED_TIME_ZONE_NAME', 'UTC')
  })
})
