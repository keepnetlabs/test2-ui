jest.mock('@/api/ldap', () => ({
  getLDAPConfigDetail: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  createLDAPConfig: jest.fn(() => Promise.resolve()),
  updateLDAPSchedule: jest.fn(() => Promise.resolve())
}))

import TargetUserLDAPImportModal from '@/components/TargetUsers/LDAP/TargetUserLDAPImportModal.vue'

describe('TargetUserLDAPImportModal.vue', () => {
  it('handleClose emits on-close', () => {
    const ctx = { $emit: jest.fn() }
    TargetUserLDAPImportModal.methods.handleClose.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-close')
  })

  it('getSelectedUsersLength returns selectedUsers length', () => {
    const ctx = { selectedUsers: [{ id: 1 }, { id: 2 }] }
    expect(TargetUserLDAPImportModal.computed.getSelectedUsersLength.call(ctx)).toBe(2)
  })

  it('isNextButtonDisabled returns true when step1Step 0 and not valid', () => {
    const ctx = {
      step1Step: 0,
      isLDAPGroupsValid: false,
      selectedLDAPItems: [],
      serverSideSelectionParams: { isSelectedAllEver: false }
    }
    expect(TargetUserLDAPImportModal.computed.isNextButtonDisabled.call(ctx)).toBe(true)
  })

  it('isNextButtonDisabled returns false when step1Step 0 and valid', () => {
    const ctx = {
      step1Step: 0,
      isLDAPGroupsValid: true,
      selectedLDAPItems: []
    }
    expect(TargetUserLDAPImportModal.computed.isNextButtonDisabled.call(ctx)).toBe(false)
  })

  it('isNextButtonDisabled returns false when step1Step 1 and isSelectedAllEver', () => {
    const ctx = {
      step1Step: 1,
      serverSideSelectionParams: { isSelectedAllEver: true },
      selectedLDAPItems: []
    }
    expect(TargetUserLDAPImportModal.computed.isNextButtonDisabled.call(ctx)).toBe(false)
  })

  it('isNextButtonDisabled returns false when step1Step 1 and has selectedLDAPItems', () => {
    const ctx = {
      step1Step: 1,
      serverSideSelectionParams: { isSelectedAllEver: false },
      selectedLDAPItems: [{ filterValue: 'g1' }]
    }
    expect(TargetUserLDAPImportModal.computed.isNextButtonDisabled.call(ctx)).toBe(false)
  })

  it('isNextButtonDisabled returns true when step1Step 1 and no selection', () => {
    const ctx = {
      step1Step: 1,
      serverSideSelectionParams: { isSelectedAllEver: false },
      selectedLDAPItems: []
    }
    expect(TargetUserLDAPImportModal.computed.isNextButtonDisabled.call(ctx)).toBe(true)
  })
})
