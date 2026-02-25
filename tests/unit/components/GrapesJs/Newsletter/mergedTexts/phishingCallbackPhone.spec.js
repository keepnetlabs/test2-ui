import phishingCallbackPhone from '@/components/GrapesJs/Newsletter/mergedTexts/phishingCallbackPhone'

describe('GrapesJs mergedTexts phishingCallbackPhone', () => {
  it('exports default with label and category', () => {
    expect(phishingCallbackPhone.label).toBeDefined()
    expect(phishingCallbackPhone.category).toBe('Merge Tags')
  })
})
