import CampaignManagerPrintOutPhishingScenarios from '@/components/CampaignManager/PhishingScenarios/CampaignManagerPrintOutPhishingScenarios.vue'

describe('CampaignManagerPrintOutPhishingScenarios.vue', () => {
  it('has correct component name', () => {
    expect(CampaignManagerPrintOutPhishingScenarios.name).toBe(
      'CampaignManagerPrintOutPhishingScenarios'
    )
  })

  it('computed helpers return expected empty-state text and style', () => {
    expect(
      CampaignManagerPrintOutPhishingScenarios.computed.getTableEmptyTextMessage.call({
        type: 'Phishing',
        isFilterOrSearchActive: false
      })
    ).toContain('Phishing Scenarios')
    expect(
      CampaignManagerPrintOutPhishingScenarios.computed.getContainerStyle.call({ isValid: false })
    ).toEqual({ border: '1px solid #ff5252 !important', borderRadius: '20px' })
  })

  it('toggleTemplateDialog toggles preview dialog flag', () => {
    const ctx = { isShowTemplate: false }
    CampaignManagerPrintOutPhishingScenarios.methods.toggleTemplateDialog.call(ctx)
    expect(ctx.isShowTemplate).toBe(true)
  })

  it('setSelectedTemplate updates model and emits selected item', () => {
    const $emit = jest.fn()
    const ctx = {
      trainingTabModel: {},
      $set: (obj, key, value) => {
        obj[key] = value
      },
      $emit
    }
    const item = { resourceId: 'r1' }
    CampaignManagerPrintOutPhishingScenarios.methods.setSelectedTemplate.call(ctx, item, true)
    expect(ctx.trainingTabModel.r1).toBeDefined()
    expect($emit).toHaveBeenCalledWith('input', [item])
  })

  it('resetFilters clears filters and triggers reload', () => {
    const ctx = {
      search: 'abc',
      difficulty: 'Hard',
      method: 'Email',
      language: 'EN',
      axiosPayload: { old: true },
      callForPhishingScenarios: jest.fn()
    }
    CampaignManagerPrintOutPhishingScenarios.methods.resetFilters.call(ctx)
    expect(ctx.search).toBe('')
    expect(ctx.difficulty).toBe('')
    expect(ctx.method).toBe('')
    expect(ctx.language).toBe('')
    expect(ctx.callForPhishingScenarios).toHaveBeenCalledWith(false)
  })
})
