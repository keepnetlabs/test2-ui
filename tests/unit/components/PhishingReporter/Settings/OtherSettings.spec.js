import OtherSettings from '@/components/PhishingReporter/Settings/OtherSettings.vue'

describe('PhishingReporter OtherSettings.vue', () => {
  it('getHintValues returns hint when showForm', () => {
    const ctx = { showForm: true }
    expect(OtherSettings.computed.getHintValues.call(ctx)).toEqual({
      persistentHint: true,
      hint: '*Required'
    })
  })

  it('getHintValues returns falsy when not showForm', () => {
    const ctx = { showForm: false }
    expect(OtherSettings.computed.getHintValues.call(ctx)).toBeFalsy()
  })

  it('handleEnterpriseVaultChange sets enterpriseVaultDisabled and clears url', () => {
    const ctx = {
      enterpriseVaultDisabled: false,
      formValues: { enterpriseVaultUrl: 'http://test.com' }
    }
    OtherSettings.methods.handleEnterpriseVaultChange.call(ctx, false)
    expect(ctx.enterpriseVaultDisabled).toBe(true)
    expect(ctx.formValues.enterpriseVaultUrl).toBe('')
  })

  it('handleEnterpriseVaultChange enables when value true', () => {
    const ctx = {
      enterpriseVaultDisabled: true,
      formValues: { enterpriseVaultUrl: '' }
    }
    OtherSettings.methods.handleEnterpriseVaultChange.call(ctx, true)
    expect(ctx.enterpriseVaultDisabled).toBe(false)
  })
})
