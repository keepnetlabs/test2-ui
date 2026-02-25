import senderIP from '@/components/GrapesJs/Newsletter/mergedTexts/senderIP'

describe('GrapesJs mergedTexts senderIP', () => {
  it('exports default with label and category', () => {
    expect(senderIP.label).toBeDefined()
    expect(senderIP.category).toBe('Merge Tags')
  })
})
