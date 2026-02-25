import message from '@/components/GrapesJs/Newsletter/mergedTexts/message'

describe('GrapesJs mergedTexts message', () => {
  it('exports default with label and category', () => {
    expect(message.label).toBeDefined()
    expect(message.category).toBe('Merge Tags')
  })
})
