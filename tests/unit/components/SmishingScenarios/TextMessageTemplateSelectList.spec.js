jest.mock('@/api/smishing', () => ({
  searchTextMessageTemplates: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [],
          totalNumberOfPages: 0
        }
      }
    })
  )
}))

import TextMessageTemplateSelectList from '@/components/SmishingScenarios/TextMessageTemplateSelectList.vue'

describe('TextMessageTemplateSelectList.vue', () => {
  it('getItemDescription returns nbsp when no description', () => {
    const ctx = {}
    expect(TextMessageTemplateSelectList.methods.getItemDescription.call(ctx, {})).toBe('\xa0')
  })

  it('getItemDescription returns nbsp when description is null string', () => {
    const ctx = {}
    expect(TextMessageTemplateSelectList.methods.getItemDescription.call(ctx, { description: 'null' })).toBe('\xa0')
  })

  it('getItemDescription returns nbsp when description is undefined string', () => {
    const ctx = {}
    expect(
      TextMessageTemplateSelectList.methods.getItemDescription.call(ctx, { description: 'undefined' })
    ).toBe('\xa0')
  })

  it('getItemDescription returns description when present', () => {
    const ctx = {}
    expect(
      TextMessageTemplateSelectList.methods.getItemDescription.call(ctx, { description: 'Test desc' })
    ).toBe('Test desc')
  })

  it('getTextMessage returns template when set', () => {
    const ctx = { template: { template: 'Hello' } }
    expect(TextMessageTemplateSelectList.computed.getTextMessage.call(ctx)).toBe('Hello')
  })

  it('getTextMessage returns undefined when template is null', () => {
    const ctx = { template: null }
    expect(TextMessageTemplateSelectList.computed.getTextMessage.call(ctx)).toBeUndefined()
  })

  it('getLanguageItems returns empty array', () => {
    const ctx = {}
    expect(TextMessageTemplateSelectList.computed.getLanguageItems.call(ctx)).toEqual([])
  })
})
