import VishingCampaignModal from '@/components/VishingCampaignManager/VishingCampaignModal.vue'

describe('VishingCampaignModal.vue', () => {
  it('getTitle returns New Vishing Campaign when not edit', () => {
    expect(
      VishingCampaignModal.computed.getTitle.call({ isEdit: false })
    ).toBe('New Vishing Campaign')
  })

  it('getTitle returns Edit Vishing Campaign when edit and not duplicate', () => {
    expect(
      VishingCampaignModal.computed.getTitle.call({ isEdit: true, isDuplicate: false })
    ).toBe('Edit Vishing Campaign')
  })

  it('getTitle returns Duplicate Vishing Campaign when duplicate', () => {
    expect(
      VishingCampaignModal.computed.getTitle.call({ isEdit: true, isDuplicate: true })
    ).toBe('Duplicate Vishing Campaign')
  })

  it('has data and computed', () => {
    expect(VishingCampaignModal.data).toBeDefined()
    expect(VishingCampaignModal.computed.getTitle).toBeDefined()
  })
})
