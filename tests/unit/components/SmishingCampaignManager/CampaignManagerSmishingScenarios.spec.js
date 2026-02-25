jest.mock('@/api/smishing', () => ({
  searchScenarios: jest.fn(() => Promise.resolve({ data: { data: { results: [] } } }))
}))

import CampaignManagerSmishingScenarios from '@/components/SmishingCampaignManager/CampaignManagerSmishingScenarios.vue'

describe('CampaignManagerSmishingScenarios.vue', () => {
  it('getContainerStyle returns empty when valid', () => {
    const ctx = { isValid: true }
    expect(CampaignManagerSmishingScenarios.computed.getContainerStyle.call(ctx)).toEqual({})
  })

  it('getContainerStyle returns border when invalid', () => {
    const ctx = { isValid: false }
    const style = CampaignManagerSmishingScenarios.computed.getContainerStyle.call(ctx)
    expect(style.border).toContain('1px solid')
  })

  it('getTemplateHeader returns landingPageParams name', () => {
    const ctx = { landingPageParams: { name: 'Template A' } }
    expect(CampaignManagerSmishingScenarios.computed.getTemplateHeader.call(ctx)).toBe('Template A')
  })

  it('getItems returns value when isShowSelectedScenarios', () => {
    const ctx = {
      isShowSelectedScenarios: true,
      value: [{ resourceId: 's1' }],
      phishingScenarioItems: []
    }
    expect(CampaignManagerSmishingScenarios.computed.getItems.call(ctx)).toEqual([{ resourceId: 's1' }])
  })
})
