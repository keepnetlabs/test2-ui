import description from '@/components/GrapesJs/Newsletter/mergedTexts/description'

describe('GrapesJs mergedTexts description', () => {
  it('exports default with label Description', () => {
    expect(description.label).toBe('Description')
    expect(description.category).toBe('Merge Tags')
  })
})
