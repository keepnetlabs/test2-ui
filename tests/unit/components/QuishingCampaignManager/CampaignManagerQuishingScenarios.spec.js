jest.mock('@/api/quishing', () => ({
  searchScenarios: jest.fn(() => Promise.resolve({ data: { data: { results: [] } } })),
  getEmailTemplatePreviewContent: jest.fn(() => Promise.resolve()),
  getLandingPageTemplate: jest.fn(() => Promise.resolve())
}))

import CampaignManagerQuishingScenarios from '@/components/QuishingCampaignManager/CampaignManagerQuishingScenarios.vue'

describe('CampaignManagerQuishingScenarios.vue', () => {
  it('getContainerStyle returns empty when valid', () => {
    const ctx = { isValid: true }
    expect(CampaignManagerQuishingScenarios.computed.getContainerStyle.call(ctx)).toEqual({})
  })

  it('getContainerStyle returns border style when invalid', () => {
    const ctx = { isValid: false }
    const style = CampaignManagerQuishingScenarios.computed.getContainerStyle.call(ctx)
    expect(style.border).toContain('1px solid')
  })
})
