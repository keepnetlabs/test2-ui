import QuishingCampaignManagerAddOrEditModal from '@/components/QuishingCampaignManager/QuishingCampaignManagerAddOrEditModal.vue'

describe('QuishingCampaignManagerAddOrEditModal.vue', () => {
  it('getTitle returns Edit when isEdit', () => {
    const ctx = { isEdit: true }
    expect(QuishingCampaignManagerAddOrEditModal.computed.getTitle.call(ctx)).toContain('Edit')
    expect(QuishingCampaignManagerAddOrEditModal.computed.getTitle.call(ctx)).toContain('Quishing Campaign')
  })

  it('getTitle returns New when not isEdit', () => {
    const ctx = { isEdit: false }
    expect(QuishingCampaignManagerAddOrEditModal.computed.getTitle.call(ctx)).toContain('New')
  })
})
