import NewInvestigationSettings from '@/components/Investigation/NewInvestigationSettings.vue'

describe('Investigation NewInvestigationSettings.vue', () => {
  it('isTargetUserTypeAllUsers returns true when AllUsers', () => {
    const ctx = { formData: { targetUserType: 'AllUsers' } }
    expect(NewInvestigationSettings.computed.isTargetUserTypeAllUsers.call(ctx)).toBe(true)
  })

  it('isTargetUserTypeAllUsers returns false when Groups', () => {
    const ctx = { formData: { targetUserType: 'Groups' } }
    expect(NewInvestigationSettings.computed.isTargetUserTypeAllUsers.call(ctx)).toBe(false)
  })

  it('isTargetUserTypeGroups returns true when Groups', () => {
    const ctx = { formData: { targetUserType: 'Groups' } }
    expect(NewInvestigationSettings.computed.isTargetUserTypeGroups.call(ctx)).toBe(true)
  })

  it('isTargetUserTypeUsers returns true when SpecificUsers', () => {
    const ctx = { formData: { targetUserType: 'SpecificUsers' } }
    expect(NewInvestigationSettings.computed.isTargetUserTypeUsers.call(ctx)).toBe(true)
  })

  it('handleTargetUserTypeChange sets empty string when AllUsers', () => {
    const ctx = {
      formData: { targetUserType: 'AllUsers', targetUsersValue: ['g1'] },
      $refs: { refForm: { resetValidation: jest.fn() } }
    }
    NewInvestigationSettings.methods.handleTargetUserTypeChange.call(ctx)
    expect(ctx.formData.targetUsersValue).toBe('')
  })

  it('handleTargetUserTypeChange sets empty array when not AllUsers', () => {
    const ctx = {
      formData: { targetUserType: 'Groups', targetUsersValue: 'x' },
      $refs: { refForm: { resetValidation: jest.fn() } }
    }
    NewInvestigationSettings.methods.handleTargetUserTypeChange.call(ctx)
    expect(ctx.formData.targetUsersValue).toEqual([])
  })
})
