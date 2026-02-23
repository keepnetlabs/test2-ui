jest.mock('@/api/smishing', () => ({
  previewSmishingCampaign: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          smishingScenarioPreviewList: [
            {
              name: 'Scenario A',
              methodTypeId: 4,
              textTemplate: { name: 'SMS 1', template: 'hello world' },
              landingPageTemplate: {
                name: 'Landing A',
                description: 'desc',
                urlTemplate: 'https://example.com',
                landingPages: [{ content: '<html>a</html>' }]
              },
              mfaTextTemplate: 'code is 1234',
              mfaSmsSenderNumber: '+12025550123'
            }
          ]
        }
      }
    })
  )
}))

import CampaignManagerPreview from '@/components/CallbackCampaignManager/CampaignManagerPreview.vue'
import SmishingService from '@/api/smishing'

describe('CallbackCampaignManager/CampaignManagerPreview.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('returns computed title/subtitle', () => {
    expect(CampaignManagerPreview.computed.getTitle.call({})).toBe('Smishing Campaign Preview')
    expect(
      CampaignManagerPreview.computed.getSubtitle.call({ selectedRow: { name: 'Campaign 1' } })
    ).toBe('Campaign 1')
    expect(CampaignManagerPreview.computed.getSubtitle.call({ selectedRow: null })).toBe('')
  })

  it('created hook calls data fetch and beforeDestroy clears timeout', () => {
    const createdCtx = { callForData: jest.fn() }
    CampaignManagerPreview.created.call(createdCtx)
    expect(createdCtx.callForData).toHaveBeenCalled()

    const timeoutId = setTimeout(() => {}, 1000)
    const clearSpy = jest.spyOn(global, 'clearTimeout')
    CampaignManagerPreview.beforeDestroy.call({ timeoutId })
    expect(clearSpy).toHaveBeenCalledWith(timeoutId)
    clearSpy.mockRestore()
  })

  it('setActiveScenario maps text, landing page and mfa settings', () => {
    const ctx = {
      isMethodMfa: false,
      textTemplate: null,
      textMessageTemplateParams: {},
      landingPageTemplates: [],
      landingPageParams: {}
    }
    CampaignManagerPreview.methods.setActiveScenario.call(ctx, {
      methodTypeId: '4',
      textTemplate: { name: 'SMS', template: 'Body' },
      landingPageTemplate: {
        name: 'LP',
        description: 'D',
        urlTemplate: 'url',
        landingPages: [{ content: 'x' }]
      },
      mfaTextTemplate: 'otp',
      mfaSmsSenderNumber: '555'
    })

    expect(ctx.isMethodMfa).toBe(true)
    expect(ctx.textTemplate).toBe('Body')
    expect(ctx.textMessageTemplateParams).toEqual({ name: 'SMS', textMessage: 'Body' })
    expect(ctx.landingPageTemplates).toEqual([{ content: 'x' }])
    expect(ctx.landingPageParams).toEqual({
      name: 'LP',
      description: 'D',
      urlTemplate: 'url',
      mfaTextTemplate: 'otp',
      mfaSmsSenderNumber: '555'
    })
  })

  it('callForScenarioDetail selects item by tab index', () => {
    const setActiveScenario = jest.fn()
    const ctx = {
      phishingScenarios: [{ name: 'A' }, { name: 'B' }],
      setActiveScenario
    }
    CampaignManagerPreview.methods.callForScenarioDetail.call(ctx, { index: 1 })
    expect(setActiveScenario).toHaveBeenCalledWith({ name: 'B' })
  })

  it('setLoading and handleClose set state and emit', () => {
    const ctx = { isLoading: false }
    CampaignManagerPreview.methods.setLoading.call(ctx, true)
    expect(ctx.isLoading).toBe(true)
    CampaignManagerPreview.methods.setLoading.call(ctx)
    expect(ctx.isLoading).toBe(false)

    const emit = jest.fn()
    CampaignManagerPreview.methods.handleClose.call({ $emit: emit })
    expect(emit).toHaveBeenCalledWith('on-close')
  })

  it('callForData fetches preview, selects first scenario and clears loading after timeout', async () => {
    const ctx = {
      selectedRow: { resourceId: 'res-1' },
      setLoading: jest.fn(),
      phishingScenarios: [],
      selectedScenario: null,
      timeoutId: '',
      setActiveScenario: jest.fn()
    }

    CampaignManagerPreview.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.setLoading).toHaveBeenCalledWith(true)
    expect(SmishingService.previewSmishingCampaign).toHaveBeenCalledWith('res-1')
    expect(ctx.phishingScenarios).toHaveLength(1)
    expect(ctx.selectedScenario).toBe('Scenario A')
    expect(ctx.setActiveScenario).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Scenario A' })
    )

    jest.advanceTimersByTime(500)
    expect(ctx.setLoading).toHaveBeenLastCalledWith()
  })
})
