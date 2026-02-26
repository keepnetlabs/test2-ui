jest.mock('@/api/settings', () => ({
  getSystemUserSettings: jest.fn()
}))

import { shallowMount } from '@vue/test-utils'
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

  it('renders root component and triggers created lifecycle on mount', () => {
    const dispatch = jest.fn()
    shallowMount(App, {
      mocks: {
        $store: {
          dispatch,
          getters: {
            'auth/userGetter': {}
          }
        }
      },
      stubs: ['router-view']
    })

    expect(dispatch).toHaveBeenCalledWith('login/getWhiteLabelByUrl')
  })

  it('user watcher calls getSystemUserSettings when user is not empty', () => {
    const getSystemUserSettingsMethod = jest.fn()
    App.watch.user.handler.call({ getSystemUserSettings: getSystemUserSettingsMethod }, { id: 1 })
    expect(getSystemUserSettingsMethod).toHaveBeenCalled()
  })

  it('user watcher does not call getSystemUserSettings when user is empty', () => {
    const getSystemUserSettingsMethod = jest.fn()
    App.watch.user.handler.call({ getSystemUserSettings: getSystemUserSettingsMethod }, {})
    expect(getSystemUserSettingsMethod).not.toHaveBeenCalled()
  })

  it('user watcher config is deep', () => {
    expect(App.watch.user.deep).toBe(true)
  })

  it('computed user getter reads value from vuex getter map', () => {
    const user = { id: 'u-1', name: 'Test User' }
    const ctx = {
      $store: {
        getters: {
          'auth/userGetter': user
        }
      }
    }

    expect(App.computed.user.call(ctx)).toEqual(user)
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

  it('getSystemUserSettings commits null formats when response has no date/time format', async () => {
    const setItemSpy = jest.fn()
    localStorage.setItem = setItemSpy
    getSystemUserSettings.mockResolvedValueOnce({
      data: {
        data: {
          timeZoneId: 'Europe/Istanbul',
          timeZoneName: 'TR'
        }
      }
    })
    const commit = jest.fn()
    const ctx = { $store: { commit } }

    App.methods.getSystemUserSettings.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(setItemSpy).not.toHaveBeenCalled()
    expect(commit).toHaveBeenCalledWith('auth/SET_FORMATS', {
      dateFormat: null,
      timeFormat: null
    })
    expect(commit).toHaveBeenCalledWith('common/SET_SELECTED_TIME_ZONE', 'Europe/Istanbul')
    expect(commit).toHaveBeenCalledWith('common/SET_SELECTED_TIME_ZONE_NAME', 'TR')
  })

  it('getSystemUserSettings stores only date format when time format is missing', async () => {
    const setItemSpy = jest.fn()
    localStorage.setItem = setItemSpy
    getSystemUserSettings.mockResolvedValueOnce({
      data: {
        data: {
          dateFormat: 'MM-DD-YYYY',
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

    expect(setItemSpy).toHaveBeenCalledWith('selectedDateFormat', 'MM-DD-YYYY')
    expect(setItemSpy).not.toHaveBeenCalledWith('selectedTimeFormat', expect.anything())
    expect(commit).toHaveBeenCalledWith('auth/SET_FORMATS', {
      dateFormat: 'MM-DD-YYYY',
      timeFormat: null
    })
  })

  it('getSystemUserSettings stores only time format when date format is missing', async () => {
    const setItemSpy = jest.fn()
    localStorage.setItem = setItemSpy
    getSystemUserSettings.mockResolvedValueOnce({
      data: {
        data: {
          timeFormat: 'hh:mm A',
          timeZoneId: 'Europe/Berlin',
          timeZoneName: 'Berlin'
        }
      }
    })
    const commit = jest.fn()
    const ctx = { $store: { commit } }

    App.methods.getSystemUserSettings.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(setItemSpy).toHaveBeenCalledWith('selectedTimeFormat', 'hh:mm A')
    expect(setItemSpy).not.toHaveBeenCalledWith('selectedDateFormat', expect.anything())
    expect(commit).toHaveBeenCalledWith('auth/SET_FORMATS', {
      dateFormat: null,
      timeFormat: 'hh:mm A'
    })
  })
})
