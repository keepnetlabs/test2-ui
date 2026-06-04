import CampaignManagerAddOrEditModal from '@/components/CampaignManager/CampaignManagerAddOrEditModal.vue'

describe('CampaignManagerAddOrEditModal.vue — hasEmailTemplateMultipleLanguage', () => {
  const call = (selectedPhishingScenarios) =>
    CampaignManagerAddOrEditModal.computed.hasEmailTemplateMultipleLanguage.call({
      selectedPhishingScenarios
    })

  it('returns false when languageTypeCode is missing', () => {
    expect(call([{ resourceId: 'a' }])).toBe(false)
  })

  it('returns false for single-language scenarios', () => {
    expect(call([{ resourceId: 'a', languageTypeCode: ['en'] }])).toBe(false)
  })

  it('returns true when any selected scenario has more than one language code', () => {
    expect(
      call([
        { resourceId: 'a', languageTypeCode: ['en'] },
        { resourceId: 'b', languageTypeCode: ['en', 'tr'] }
      ])
    ).toBe(true)
  })

  it('returns false for empty selection', () => {
    expect(call([])).toBe(false)
  })
})
