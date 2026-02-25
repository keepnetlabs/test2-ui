jest.mock('@/api/mailConfiguration', () => ({
  checkApiConnectivityGoogleWorkspace: jest.fn(() => Promise.resolve()),
  checkPrivilegesGoogleWorkspace: jest.fn(() => Promise.resolve()),
  checkAllUsersAccessGoogleWorkspace: jest.fn(() => Promise.resolve()),
  checkEmailAccessGoogleWorkspace: jest.fn(() => Promise.resolve()),
  checkCreateNewCategoryGoogleWorkspace: jest.fn(() => Promise.resolve()),
  checkUpdateCategoryGoogleWorkspace: jest.fn(() => Promise.resolve()),
  checkDeleteEmailGoogleWorkspace: jest.fn(() => Promise.resolve()),
  checkInboxAccessGoogleWorkspace: jest.fn(() => Promise.resolve())
}))

import TestConnectionGoogleWorkspace from '@/components/MailConfiguration/TestConnectionGoogleWorkspace.vue'

describe('TestConnectionGoogleWorkspace.vue', () => {
  it('isAllSuccess returns true when all checks are success', () => {
    const ctx = {
      checkApiConnectivity: 'success',
      checkPrivileges: 'success',
      checkAllUsersAccess: 'success',
      checkEmailAccess: 'success',
      checkCreateNewCategory: 'success',
      checkUpdateCategory: 'success',
      checkDeleteEmail: 'success',
      checkInboxAccess: 'success'
    }
    expect(TestConnectionGoogleWorkspace.computed.isAllSuccess.call(ctx)).toBe(true)
  })

  it('isAllSuccess returns false when one check fails', () => {
    const ctx = {
      checkApiConnectivity: 'success',
      checkPrivileges: 'error',
      checkAllUsersAccess: 'success',
      checkEmailAccess: 'success',
      checkCreateNewCategory: 'success',
      checkUpdateCategory: 'success',
      checkDeleteEmail: 'success',
      checkInboxAccess: 'success'
    }
    expect(TestConnectionGoogleWorkspace.computed.isAllSuccess.call(ctx)).toBe(false)
  })

  it('checkIfAllSuccess emits testConnectionValues', () => {
    const ctx = {
      isAllSuccess: true,
      isSave: false,
      $emit: jest.fn()
    }
    TestConnectionGoogleWorkspace.methods.checkIfAllSuccess.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('testConnectionValues', true, false)
  })
})
