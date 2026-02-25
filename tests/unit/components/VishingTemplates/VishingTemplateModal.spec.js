import VishingTemplateModal from '@/components/VishingTemplates/VishingTemplateModal.vue'

describe('VishingTemplateModal.vue', () => {
  it('getTitle returns New Vishing Template when not edit', () => {
    expect(
      VishingTemplateModal.computed.getTitle.call({ isEdit: false })
    ).toBe('New Vishing Template')
  })

  it('getTitle returns Edit Vishing Template when edit and not duplicate', () => {
    expect(
      VishingTemplateModal.computed.getTitle.call({ isEdit: true, isDuplicate: false })
    ).toBe('Edit Vishing Template')
  })

  it('getTitle returns Duplicate Vishing Template when duplicate', () => {
    expect(
      VishingTemplateModal.computed.getTitle.call({ isEdit: true, isDuplicate: true })
    ).toBe('Duplicate Vishing Template')
  })
})
