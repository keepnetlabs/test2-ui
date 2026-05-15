import CreateOrEditSystemUser from '@/components/SystemUsers/CreateOrEditSystemUser.vue'

describe('CreateOrEditSystemUser.vue', () => {
  it('detects configured company IP restrictions from supported response shapes', () => {
    const hasCompanyIpRestrictions = CreateOrEditSystemUser.methods.hasCompanyIpRestrictions

    expect(hasCompanyIpRestrictions([{ resourceId: 'abc', ipRange: '10.0.0.1' }])).toBe(true)
    expect(hasCompanyIpRestrictions({ results: [{ resourceId: 'abc' }] })).toBe(true)
    expect(hasCompanyIpRestrictions({ ipRestrictions: [{ resourceId: 'abc' }] })).toBe(true)
    expect(hasCompanyIpRestrictions({ ipRanges: ['10.0.0.1'] })).toBe(true)
  })

  it('detects missing company IP restrictions safely', () => {
    const hasCompanyIpRestrictions = CreateOrEditSystemUser.methods.hasCompanyIpRestrictions

    expect(hasCompanyIpRestrictions()).toBe(false)
    expect(hasCompanyIpRestrictions([])).toBe(false)
    expect(hasCompanyIpRestrictions({ results: [] })).toBe(false)
    expect(hasCompanyIpRestrictions({ ipRestrictions: [] })).toBe(false)
    expect(hasCompanyIpRestrictions({ ipRanges: [] })).toBe(false)
  })
})
