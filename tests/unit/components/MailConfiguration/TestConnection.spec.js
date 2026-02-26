jest.mock('@/api/mailConfiguration', () => ({
  checkAllUsersAccess: jest.fn(() => Promise.resolve()),
  checkApiConnectivity: jest.fn(() => Promise.resolve()),
  checkCreateNewCategory: jest.fn(() => Promise.resolve()),
  checkDeleteEmail: jest.fn(() => Promise.resolve()),
  checkEmailAccess: jest.fn(() => Promise.resolve()),
  checkInboxAccess: jest.fn(() => Promise.resolve()),
  checkPrivileges: jest.fn(() => Promise.resolve()),
  checkUpdateCategory: jest.fn(() => Promise.resolve())
}))

import TestConnection from '@/components/MailConfiguration/TestConnection.vue'
import { checkApiConnectivity, checkUpdateCategory } from '@/api/mailConfiguration'

describe('TestConnection.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('setLoadingStates sets all states to loading', () => {
    const ctx = {}
    TestConnection.methods.setLoadingStates.call(ctx)

    expect(ctx.checkApiConnectivity).toBe('loading')
    expect(ctx.checkPrivileges).toBe('loading')
    expect(ctx.checkAllUsersAccess).toBe('loading')
    expect(ctx.checkEmailAccess).toBe('loading')
    expect(ctx.checkCreateNewCategory).toBe('loading')
    expect(ctx.checkUpdateCategory).toBe('loading')
    expect(ctx.checkDeleteEmail).toBe('loading')
    expect(ctx.checkInboxAccess).toBe('loading')
  })

  it('getAxiosErrorMessage prefers validation message then fallback message', () => {
    const first = TestConnection.methods.getAxiosErrorMessage.call({}, {
      response: { data: { validationMessages: ['Invalid app id'], message: 'fallback' } }
    })
    const second = TestConnection.methods.getAxiosErrorMessage.call({}, {
      response: { data: { message: 'fallback-only' } }
    })

    expect(first).toBe('Invalid app id')
    expect(second).toBe('fallback-only')
  })

  it('isLoading emits loading when no loading state remains', () => {
    const ctx = {
      checkApiConnectivity: 'success',
      checkPrivileges: 'success',
      checkAllUsersAccess: 'success',
      checkEmailAccess: 'success',
      checkCreateNewCategory: 'success',
      checkUpdateCategory: 'success',
      checkDeleteEmail: 'success',
      checkInboxAccess: 'success',
      $emit: jest.fn()
    }

    const value = TestConnection.computed.isLoading.call(ctx)
    expect(value).toBe(false)
    expect(ctx.$emit).toHaveBeenCalledWith('loading')
  })

  it('isAllSuccess returns true only when all checks are success', () => {
    const successCtx = {
      checkApiConnectivity: 'success',
      checkPrivileges: 'success',
      checkAllUsersAccess: 'success',
      checkEmailAccess: 'success',
      checkCreateNewCategory: 'success',
      checkUpdateCategory: 'success',
      checkDeleteEmail: 'success',
      checkInboxAccess: 'success'
    }
    const failCtx = { ...successCtx, checkPrivileges: 'error' }

    expect(TestConnection.computed.isAllSuccess.call(successCtx)).toBe(true)
    expect(TestConnection.computed.isAllSuccess.call(failCtx)).toBe(false)
  })

  it('testConnection stops when validation fails', () => {
    const ctx = {
      isTesting: false,
      isSave: false,
      isValidate: jest.fn(() => false),
      setLoadingStates: jest.fn(),
      values: {}
    }

    TestConnection.methods.testConnection.call(ctx, true)
    expect(ctx.isTesting).toBe(true)
    expect(ctx.isSave).toBe(true)
    expect(ctx.setLoadingStates).not.toHaveBeenCalled()
    expect(checkApiConnectivity).not.toHaveBeenCalled()
  })

  it('testConnection includes resourceId for edit mode and triggers update category', async () => {
    const ctx = {
      isTesting: false,
      isSave: false,
      isValidate: jest.fn(() => true),
      setLoadingStates: TestConnection.methods.setLoadingStates,
      checkIfAllSuccess: jest.fn(),
      getAxiosErrorMessage: TestConnection.methods.getAxiosErrorMessage,
      values: {
        applicationId: 'app',
        applicationSecret: 'secret',
        directoryId: 'dir',
        email: 'mail@x.com'
      },
      isEdit: { resourceId: 'rid-1' }
    }

    TestConnection.methods.testConnection.call(ctx, false)
    await Promise.resolve()
    await Promise.resolve()

    expect(checkApiConnectivity).toHaveBeenCalledWith(
      expect.objectContaining({
        applicationId: 'app',
        applicationSecret: 'secret',
        directoryId: 'dir',
        email: 'mail@x.com',
        resourceId: 'rid-1'
      })
    )
    expect(checkUpdateCategory).toHaveBeenCalled()
  })
})
