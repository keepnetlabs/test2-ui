import toName from '@/components/GrapesJs/Newsletter/mergedTexts/toName'

describe('GrapesJs mergedTexts toName', () => {
  it('exports default with label and category', () => {
    expect(toName.label).toBeDefined()
    expect(toName.category).toBe('Merge Tags')
  })
})
