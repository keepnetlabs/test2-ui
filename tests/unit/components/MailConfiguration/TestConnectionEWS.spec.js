jest.mock('@/api/mailConfiguration', () => ({
  checkApiConnectivityEWS: jest.fn(() => Promise.resolve()),
  checkPrivilegesEWS: jest.fn(() => Promise.resolve()),
  checkInboxAccessEWS: jest.fn(() => Promise.resolve()),
  checkEmailBodyAccessEWS: jest.fn(() => Promise.resolve()),
  checkEmailHeaderAccessEWS: jest.fn(() => Promise.resolve()),
  checkEmailMailFilterEWS: jest.fn(() => Promise.resolve())
}))

import TestConnectionEWS from '@/components/MailConfiguration/TestConnectionEWS.vue'

describe('TestConnectionEWS.vue', () => {
  it('isAllSuccess returns true when all checks are success', () => {
    const ctx = {
      checkApiConnectivity: 'success',
      checkPrivileges: 'success',
      checkInboxAccess: 'success',
      checkEmailBodyAccess: 'success',
      checkEmailHeaderAccess: 'success',
      checkEmailMailFilter: 'success'
    }
    expect(TestConnectionEWS.computed.isAllSuccess.call(ctx)).toBe(true)
  })

  it('isAllSuccess returns false when one check is not success', () => {
    const ctx = {
      checkApiConnectivity: 'success',
      checkPrivileges: 'error',
      checkInboxAccess: 'success',
      checkEmailBodyAccess: 'success',
      checkEmailHeaderAccess: 'success',
      checkEmailMailFilter: 'success'
    }
    expect(TestConnectionEWS.computed.isAllSuccess.call(ctx)).toBe(false)
  })

  it('checkIfAllSuccess emits testConnectionValues', () => {
    const ctx = {
      isAllSuccess: true,
      isSave: false,
      $emit: jest.fn()
    }
    TestConnectionEWS.methods.checkIfAllSuccess.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('testConnectionValues', true, false)
  })
})
