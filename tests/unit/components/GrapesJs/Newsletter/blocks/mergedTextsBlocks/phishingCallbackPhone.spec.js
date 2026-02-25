import phishingCallbackPhone from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/phishingCallbackPhone'

describe('GrapesJs mergedTextsBlocks phishingCallbackPhone', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(phishingCallbackPhone)).toBe(true)
    expect(phishingCallbackPhone[0]).toHaveProperty('tagName')
    expect(phishingCallbackPhone[0]).toHaveProperty('content')
  })
})
