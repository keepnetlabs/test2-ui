jest.mock('@/api/proxySettings', () => ({
  __esModule: true,
  createProxySettings: jest.fn(() => Promise.resolve()),
  updateProxySettings: jest.fn(() => Promise.resolve()),
  testConnection: jest.fn(() => Promise.resolve()),
  getProxySettings: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          name: 'Proxy A',
          address: '1.1.1.1',
          port: '8080',
          authenticationTypeId: 1,
          username: 'user',
          password: 'pass',
          isDefault: true
        }
      }
    })
  )
}))

jest.mock('@/utils/functions', () => ({
  __esModule: true,
  scrollToComponent: jest.fn(),
  isDifferent: jest.fn(() => false),
  getTimeZone: jest.fn(() => 'yyyy/MM/dd HH:mm'),
  cancellableAxiosRequest: jest.fn((fn) => fn)
}))

import NewProxySettings from '@/components/Company Settings/ProxySettings/NewProxySettings.vue'
import {
  createProxySettings,
  updateProxySettings,
  testConnection,
  getProxySettings
} from '@/api/proxySettings'

describe('NewProxySettings.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(NewProxySettings.name).toBe('NewProxySettings')
  })

  it('computed title and password helpers reflect mode', () => {
    expect(NewProxySettings.computed.getTitle.call({ isEdit: false, resourceId: '' })).toBe(
      'Create Proxy Setting'
    )
    expect(NewProxySettings.computed.getTitle.call({ isEdit: true, resourceId: 'x' })).toBe(
      'Edit Proxy Setting'
    )
    expect(NewProxySettings.computed.passwordFieldType.call({ showPassword: false })).toBe('password')
    expect(NewProxySettings.computed.passwordAppendIcon.call({ isEdit: false, showPassword: true })).toBe(
      'mdi-eye-outline'
    )
  })

  it('callForGetProxySettings fills form values', async () => {
    const ctx = {
      resourceId: 'r1',
      formValues: { name: '', address: '', port: '', authenticationTypeId: 0, userName: '', password: '', isDefault: false },
      initialFormValues: null
    }
    await NewProxySettings.methods.callForGetProxySettings.call(ctx)
    expect(getProxySettings).toHaveBeenCalledWith('r1')
    expect(ctx.formValues.name).toBe('Proxy A')
    expect(ctx.formValues.userName).toBe('user')
  })

  it('handleTestConnection toggles state and calls api', async () => {
    const ctx = {
      resourceId: 'r1',
      isTesting: false,
      saveDisable: true,
      testConnectionSuccess: false,
      timeoutId: null,
      formValues: {
        address: '1.1.1.1',
        authenticationTypeId: 1,
        userName: 'u',
        password: 'p',
        testUrl: 'https://a.com',
        port: '8080'
      },
      clearTimeoutIfHasTimeout: jest.fn(),
      $refs: { refForm: { validate: () => true } }
    }
    NewProxySettings.methods.handleTestConnection.call(ctx)
    await Promise.resolve()
    await Promise.resolve()
    expect(testConnection).toHaveBeenCalled()
    expect(ctx.isTesting).toBe(false)
    expect(ctx.testConnectionSuccess).toBe(true)
  })

  it('submit calls create for new settings and update for edit settings', async () => {
    const newCtx = {
      isEdit: false,
      resourceId: '',
      saveDisable: true,
      formValues: {
        address: '1.1.1.1',
        name: 'Proxy A',
        authenticationTypeId: 0,
        userName: 'u',
        password: 'p',
        testUrl: 'https://a.com',
        port: '8080',
        isDefault: false
      },
      $refs: { refForm: { validate: () => true } },
      callForCreateProxySettings: jest.fn(),
      callForUpdateProxySettings: jest.fn()
    }
    NewProxySettings.methods.submit.call(newCtx)
    expect(newCtx.callForCreateProxySettings).toHaveBeenCalled()

    const editCtx = { ...newCtx, isEdit: true, resourceId: 'r1' }
    NewProxySettings.methods.submit.call(editCtx)
    expect(editCtx.callForUpdateProxySettings).toHaveBeenCalled()
  })

  it('create/update helpers call APIs and emit closeOverlayWithUpdate', async () => {
    const $emit = jest.fn()
    const payload = { Name: 'A' }
    const createCtx = { $emit, saveDisable: true }
    NewProxySettings.methods.callForCreateProxySettings.call(createCtx, payload)
    await Promise.resolve()
    await Promise.resolve()
    expect(createProxySettings).toHaveBeenCalledWith(payload)
    expect($emit).toHaveBeenCalledWith('closeOverlayWithUpdate')

    const updateCtx = { $emit, saveDisable: true, resourceId: 'r1' }
    NewProxySettings.methods.callForUpdateProxySettings.call(updateCtx, payload)
    await Promise.resolve()
    await Promise.resolve()
    expect(updateProxySettings).toHaveBeenCalledWith({ ...payload, resourceId: 'r1' })
    expect($emit).toHaveBeenCalledWith('closeOverlayWithUpdate')
  })
})
