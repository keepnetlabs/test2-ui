import CommonCampaignManagerSmishingPreviewDialog from '@/components/Common/CampaignManager/CommonCampaignManagerSmishingPreviewDialog.vue'

describe('CommonCampaignManagerSmishingPreviewDialog.vue (extra branching)', () => {
  const comp = CommonCampaignManagerSmishingPreviewDialog

  describe('setActiveScenario edge cases', () => {
    const baseCtx = () => ({
      isMethodMfa: true,
      textTemplate: 'x',
      textMessageTemplateParams: { name: 'old' },
      landingPageTemplates: [1],
      landingPageParams: { name: 'old' }
    })

    it('resets to empty defaults when DTO is empty', () => {
      const ctx = baseCtx()
      comp.methods.setActiveScenario.call(ctx, {})
      expect(ctx.isMethodMfa).toBe(false)
      expect(ctx.textTemplate).toBe('')
      expect(ctx.textMessageTemplateParams).toEqual({ name: '' })
      expect(ctx.landingPageTemplates).toEqual([])
      expect(ctx.landingPageParams).toMatchObject({
        name: '',
        description: '',
        urlTemplate: '',
        mfaTextTemplate: undefined,
        mfaSmsSenderNumber: undefined,
        isAssistedByAI: undefined
      })
    })

    it('accepts string methodTypeId 4 for MFA', () => {
      const ctx = baseCtx()
      comp.methods.setActiveScenario.call(ctx, { methodTypeId: '4' })
      expect(ctx.isMethodMfa).toBe(true)
    })

    it('passes root-level MFA fields into landingPageParams', () => {
      const ctx = baseCtx()
      comp.methods.setActiveScenario.call(ctx, {
        methodTypeId: 1,
        mfaTextTemplate: { body: 'mfa' },
        mfaSmsSenderNumber: '+90',
        landingPageTemplate: { landingPages: [] }
      })
      expect(ctx.landingPageParams.mfaTextTemplate).toEqual({ body: 'mfa' })
      expect(ctx.landingPageParams.mfaSmsSenderNumber).toBe('+90')
    })
  })
})
