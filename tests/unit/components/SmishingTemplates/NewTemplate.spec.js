jest.mock('@/api/smishing', () => ({
  getTextMessageTemplate: jest.fn(() => Promise.resolve({ data: { data: {} } }))
}))

import NewTemplate from '@/components/SmishingTemplates/NewTemplate.vue'

describe('SmishingTemplates NewTemplate.vue', () => {
  it('getTitle returns New Text Message Template when not edit', () => {
    const ctx = { isEdit: false, isDuplicate: false }
    expect(NewTemplate.computed.getTitle.call(ctx)).toBe('New Text Message Template')
  })

  it('getTitle returns Edit Text Message Template when edit', () => {
    const ctx = { isEdit: true, isDuplicate: false }
    expect(NewTemplate.computed.getTitle.call(ctx)).toBe('Edit Text Message Template')
  })

  it('getTitle returns Duplicate Text Message Template when edit and duplicate', () => {
    const ctx = { isEdit: true, isDuplicate: true }
    expect(NewTemplate.computed.getTitle.call(ctx)).toBe('Duplicate Text Message Template')
  })

  it('setFooterButtonIds updates footerButtonsIds when isDuplicate', () => {
    const ctx = {
      isDuplicate: true,
      footerButtonsIds: {}
    }
    NewTemplate.methods.setFooterButtonIds.call(ctx)
    expect(ctx.footerButtonsIds.cancelButton).toContain('duplicate')
  })
})
