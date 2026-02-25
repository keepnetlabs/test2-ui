jest.mock('@/api/callback', () => ({
  getCallbackTemplateLanguages: jest.fn().mockResolvedValue({ data: { data: [] } }),
  getCampaignSummary: jest.fn().mockResolvedValue({}),
  getCallbackCampaignJobFormDetails: jest.fn().mockResolvedValue({ data: { data: null } })
}))
jest.mock('@/api/targetUsers', () => ({
  getTargetUserCustomFieldsByCompanyId: jest.fn().mockResolvedValue({ data: { data: [] } })
}))

import CallbackReport from '@/views/CallbackReport.vue'
import CallbackService from '@/api/callback'

describe('CallbackReport.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('provide returns campaignDurationExpired getter', () => {
    const provide = CallbackReport.provide.call({
      campaignDurationExpired: true
    })
    expect(provide.campaignDurationExpired()).toBe(true)
  })

  it('computed id returns route params id', () => {
    const ctx = { $route: { params: { id: 'camp-1' } } }
    expect(CallbackReport.computed.id.call(ctx)).toBe('camp-1')
  })

  it('computed instanceGroup returns route params instanceGroup', () => {
    const ctx = { $route: { params: { instanceGroup: 'grp-1' } } }
    expect(CallbackReport.computed.instanceGroup.call(ctx)).toBe('grp-1')
  })

  it('callForLanguages calls API and sets languageItems', async () => {
    CallbackService.getCallbackTemplateLanguages.mockResolvedValueOnce({
      data: { data: [{ id: 'en' }] }
    })
    const ctx = { languageItems: [] }
    CallbackReport.methods.callForLanguages.call(ctx)
    await Promise.resolve()
    expect(ctx.languageItems).toEqual([{ id: 'en' }])
  })

  it('callForFormDetails calls API and sets formDetails', async () => {
    CallbackService.getCallbackCampaignJobFormDetails.mockResolvedValueOnce({
      data: { data: { fields: [] } }
    })
    const ctx = { formDetails: null }
    CallbackReport.methods.callForFormDetails.call(ctx)
    await Promise.resolve()
    expect(ctx.formDetails).toEqual({ fields: [] })
  })
})
