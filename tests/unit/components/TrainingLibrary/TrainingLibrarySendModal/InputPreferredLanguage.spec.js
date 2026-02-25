import InputPreferredLanguage from '@/components/TrainingLibrary/TrainingLibrarySendModal/InputPreferredLanguage.vue'

describe('InputPreferredLanguage.vue', () => {
  it('has correct component name', () => {
    expect(InputPreferredLanguage.name).toBe('InputPreferredLanguage')
  })

  it('internalValue get returns value prop', () => {
    const ctx = { value: true }
    expect(InputPreferredLanguage.computed.internalValue.get.call(ctx)).toBe(true)
  })

  it('internalValue set emits input', () => {
    const emit = jest.fn()
    const ctx = { $emit: emit }
    InputPreferredLanguage.computed.internalValue.set.call(ctx, false)
    expect(emit).toHaveBeenCalledWith('input', false)
  })

  it('computedItems returns default items when useDefaultItems and empty items', () => {
    const ctx = { useDefaultItems: true, items: [] }
    const result = InputPreferredLanguage.computed.computedItems.call(ctx)
    expect(result).toHaveLength(2)
    expect(result[0].text).toContain("company's language")
    expect(result[1].text).toContain("target users' preferred language")
  })

  it('computedItems returns items when provided', () => {
    const customItems = [{ text: 'Custom', value: 'x' }]
    const ctx = { useDefaultItems: true, items: customItems }
    const result = InputPreferredLanguage.computed.computedItems.call(ctx)
    expect(result).toEqual(customItems)
  })

  it('title prop defaults to Delivery Method', () => {
    expect(InputPreferredLanguage.props.title.default).toBe('Delivery Method')
  })
})
