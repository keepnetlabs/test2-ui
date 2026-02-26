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

  it('computed helpers return safe fallbacks when route/store data is missing', () => {
    expect(CallbackReport.computed.id.call({ $route: {} })).toBeUndefined()
    expect(CallbackReport.computed.instanceGroup.call({ $route: {} })).toBeUndefined()
    expect(CallbackReport.computed.getPhishingScenarioName.call({ $store: { state: {} } })).toBe('')
  })

  it('callForSummary maps response and clears loading in finally', async () => {
    CallbackService.getCampaignSummary.mockResolvedValueOnce({
      data: { data: { campaignDurationExpired: true } }
    })
    const ctx = {
      id: 'camp-1',
      instanceGroup: 'grp-1',
      apiResponse: null,
      campaignDurationExpired: false,
      isLoading: true
    }

    CallbackReport.methods.callForSummary.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(CallbackService.getCampaignSummary).toHaveBeenCalledWith('camp-1', 'grp-1')
    expect(ctx.apiResponse).toEqual({ data: { data: { campaignDurationExpired: true } } })
    expect(ctx.campaignDurationExpired).toBe(true)
    expect(ctx.isLoading).toBe(false)
  })

  it('callForSummary keeps campaignDurationExpired false when payload is missing', async () => {
    CallbackService.getCampaignSummary.mockResolvedValueOnce({})
    const ctx = {
      id: 'camp-2',
      instanceGroup: 'grp-2',
      apiResponse: null,
      campaignDurationExpired: true,
      isLoading: true
    }

    CallbackReport.methods.callForSummary.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.campaignDurationExpired).toBe(false)
    expect(ctx.isLoading).toBe(false)
  })

  it('created hook calls all data loaders', () => {
    const ctx = {
      callForLanguages: jest.fn(),
      callForSummary: jest.fn(),
      callForCustomFields: jest.fn(),
      callForFormDetails: jest.fn()
    }

    CallbackReport.created.call(ctx)

    expect(ctx.callForLanguages).toHaveBeenCalledTimes(1)
    expect(ctx.callForSummary).toHaveBeenCalledTimes(1)
    expect(ctx.callForCustomFields).toHaveBeenCalledTimes(1)
    expect(ctx.callForFormDetails).toHaveBeenCalledTimes(1)
  })
})
