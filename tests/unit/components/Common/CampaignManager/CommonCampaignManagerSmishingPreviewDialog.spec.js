import CommonCampaignManagerSmishingPreviewDialog from '@/components/Common/CampaignManager/CommonCampaignManagerSmishingPreviewDialog.vue'

describe('CommonCampaignManagerSmishingPreviewDialog.vue', () => {
  const comp = CommonCampaignManagerSmishingPreviewDialog

  describe('computed', () => {
    it('getTitle is fixed Smishing label', () => {
      expect(comp.computed.getTitle.call({})).toBe('Smishing Campaign Preview')
    })

    it('getSubtitle uses selectedRow.name or empty string', () => {
      expect(comp.computed.getSubtitle.call({ selectedRow: { name: 'Run A' } })).toBe('Run A')
      expect(comp.computed.getSubtitle.call({ selectedRow: {} })).toBe('')
      expect(comp.computed.getSubtitle.call({ selectedRow: undefined })).toBe('')
    })
  })

  describe('setActiveScenario branching', () => {
    const baseCtx = () => ({
      isMethodMfa: false,
      textTemplate: null,
      textMessageTemplateParams: {},
      landingPageTemplates: [],
      landingPageParams: {}
    })

    it('sets isMethodMfa when methodTypeId stringifies to 4', () => {
      const ctx = baseCtx()
      comp.methods.setActiveScenario.call(ctx, { methodTypeId: 4 })
      expect(ctx.isMethodMfa).toBe(true)

      comp.methods.setActiveScenario.call(ctx, { methodTypeId: '3' })
      expect(ctx.isMethodMfa).toBe(false)
    })

    it('maps text template and landing metadata', () => {
      const ctx = baseCtx()
      comp.methods.setActiveScenario.call(ctx, {
        methodTypeId: 1,
        textTemplate: { name: 'SMS', template: 'Hello' },
        landingPageTemplate: {
          name: 'LP',
          description: 'D',
          urlTemplate: 'https://x',
          landingPages: [{ id: 1 }]
        }
      })
      expect(ctx.textTemplate).toBe('Hello')
      expect(ctx.textMessageTemplateParams).toEqual({ name: 'SMS' })
      expect(ctx.landingPageTemplates).toEqual([{ id: 1 }])
      expect(ctx.landingPageParams.name).toBe('LP')
      expect(ctx.landingPageParams.description).toBe('D')
      expect(ctx.landingPageParams.urlTemplate).toBe('https://x')
    })

    it('prefers isAssistedByAI then isAssistedbyAI for assisted flag', () => {
      const ctx = baseCtx()
      comp.methods.setActiveScenario.call(ctx, {
        landingPageTemplate: { isAssistedByAI: true, landingPages: [] }
      })
      expect(ctx.landingPageParams.isAssistedByAI).toBe(true)

      const ctx2 = baseCtx()
      comp.methods.setActiveScenario.call(ctx2, {
        landingPageTemplate: { isAssistedbyAI: true, isAssistedByAI: false, landingPages: [] }
      })
      expect(ctx2.landingPageParams.isAssistedByAI).toBe(true)
    })
  })

  describe('methods', () => {
    it('callForScenarioDetail delegates to setActiveScenario by index', () => {
      const scenarios = [{ name: 'First' }, { name: 'Second', methodTypeId: 4 }]
      const setActiveScenario = jest.fn()
      comp.methods.callForScenarioDetail.call(
        { phishingScenarios: scenarios, setActiveScenario },
        { index: 1 }
      )
      expect(setActiveScenario).toHaveBeenCalledWith(scenarios[1])
    })

    it('setLoading toggles isLoading', () => {
      const ctx = { isLoading: false }
      comp.methods.setLoading.call(ctx, true)
      expect(ctx.isLoading).toBe(true)
      comp.methods.setLoading.call(ctx)
      expect(ctx.isLoading).toBe(false)
    })

    it('handleEditCampaign emits with selectedRow', () => {
      const emit = jest.fn()
      const selectedRow = { resourceId: 'r1' }
      comp.methods.handleEditCampaign.call({ $emit: emit, selectedRow })
      expect(emit).toHaveBeenCalledWith('on-edit-campaign', selectedRow)
    })
  })
})
