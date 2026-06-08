import CreateOrEditSystemUser from '@/components/SystemUsers/CreateOrEditSystemUser.vue'
import { getCompanyIpRestrictions } from '@/api/companyIpRestrictions'

jest.mock('@/api/companyIpRestrictions', () => ({
  getCompanyIpRestrictions: jest.fn()
}))

const setVisibilityState = (state) =>
  Object.defineProperty(document, 'visibilityState', { value: state, configurable: true })

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

  describe('re-checking IP restrictions when returning to the form tab', () => {
    const { refreshIpRestrictions, handleVisibilityChange, hasCompanyIpRestrictions } =
      CreateOrEditSystemUser.methods

    beforeEach(() => {
      getCompanyIpRestrictions.mockReset()
    })

    it('refreshIpRestrictions enables the toggle once a restriction is configured', async () => {
      getCompanyIpRestrictions.mockResolvedValue({ data: { data: [{ resourceId: 'abc' }] } })
      const ctx = { hasIpRestrictions: false, hasCompanyIpRestrictions }

      await refreshIpRestrictions.call(ctx)

      expect(getCompanyIpRestrictions).toHaveBeenCalled()
      expect(ctx.hasIpRestrictions).toBe(true)
    })

    it('refreshIpRestrictions keeps the toggle disabled when none is configured', async () => {
      getCompanyIpRestrictions.mockResolvedValue({ data: { data: [] } })
      const ctx = { hasIpRestrictions: false, hasCompanyIpRestrictions }

      await refreshIpRestrictions.call(ctx)

      expect(ctx.hasIpRestrictions).toBe(false)
    })

    it('refreshIpRestrictions leaves state untouched when the request fails', async () => {
      getCompanyIpRestrictions.mockRejectedValue(new Error('network'))
      const ctx = { hasIpRestrictions: false, hasCompanyIpRestrictions }

      await refreshIpRestrictions.call(ctx)

      expect(ctx.hasIpRestrictions).toBe(false)
    })

    it('re-fetches when the tab becomes visible and no restriction is configured yet', () => {
      setVisibilityState('visible')
      const refreshIpRestrictionsSpy = jest.fn()

      handleVisibilityChange.call({
        hasIpRestrictions: false,
        refreshIpRestrictions: refreshIpRestrictionsSpy
      })

      expect(refreshIpRestrictionsSpy).toHaveBeenCalled()
    })

    it('does not re-fetch once a restriction is already configured', () => {
      setVisibilityState('visible')
      const refreshIpRestrictionsSpy = jest.fn()

      handleVisibilityChange.call({
        hasIpRestrictions: true,
        refreshIpRestrictions: refreshIpRestrictionsSpy
      })

      expect(refreshIpRestrictionsSpy).not.toHaveBeenCalled()
    })

    it('does not re-fetch while the tab is hidden', () => {
      setVisibilityState('hidden')
      const refreshIpRestrictionsSpy = jest.fn()

      handleVisibilityChange.call({
        hasIpRestrictions: false,
        refreshIpRestrictions: refreshIpRestrictionsSpy
      })

      expect(refreshIpRestrictionsSpy).not.toHaveBeenCalled()
    })
  })
})
