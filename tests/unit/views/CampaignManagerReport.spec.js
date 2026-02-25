jest.mock('@/api/phishingsimulator', () => ({
  getCampaignManagerJobFormDetails: jest.fn().mockResolvedValue({ data: { data: null } }),
  getCampaignJobSummary: jest.fn().mockResolvedValue({})
}))
jest.mock('@/api/targetUsers', () => ({
  getTargetUserCustomFieldsByCompanyId: jest.fn().mockResolvedValue({ data: { data: [] } })
}))

import CampaignManagerReport from '@/views/CampaignManagerReport.vue'

describe('CampaignManagerReport.vue', () => {
  it('provide returns campaignDurationExpired getter', () => {
    const provide = CampaignManagerReport.provide.call({
      campaignDurationExpired: true
    })
    expect(provide.campaignDurationExpired()).toBe(true)
  })

  it('computed id returns route params id', () => {
    const ctx = { $route: { params: { id: 'camp-1' } } }
    expect(CampaignManagerReport.computed.id.call(ctx)).toBe('camp-1')
  })

  it('computed instanceGroup returns route params instanceGroup', () => {
    const ctx = { $route: { params: { instanceGroup: 'grp-1' } } }
    expect(CampaignManagerReport.computed.instanceGroup.call(ctx)).toBe('grp-1')
  })
})
