jest.mock('@/api/quishing', () => ({
  getCampaignJobSummary: jest.fn().mockResolvedValue({}),
  getCampaignJobFormDetails: jest.fn().mockResolvedValue({ data: { data: null } })
}))
jest.mock('@/api/targetUsers', () => ({
  getTargetUserCustomFieldsByCompanyId: jest.fn().mockResolvedValue({ data: { data: [] } })
}))

import QuishingCampaignManagerReport from '@/views/QuishingCampaignManagerReport.vue'

describe('QuishingCampaignManagerReport.vue', () => {
  it('has correct component name', () => {
    expect(QuishingCampaignManagerReport.name).toBe('QuishingCampaignManagerReport')
  })

  it('provide returns campaignDurationExpired getter', () => {
    const provide = QuishingCampaignManagerReport.provide.call({
      campaignDurationExpired: true
    })
    expect(provide.campaignDurationExpired()).toBe(true)
  })

  it('computed id returns route params id', () => {
    const ctx = { $route: { params: { id: 'qcm-1' } } }
    expect(QuishingCampaignManagerReport.computed.id.call(ctx)).toBe('qcm-1')
  })
})
