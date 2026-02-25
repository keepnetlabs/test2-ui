import fileName from '@/components/GrapesJs/Newsletter/mergedTexts/fileName'

describe('GrapesJs mergedTexts fileName', () => {
  it('exports default with label and category', () => {
    expect(fileName.label).toBeDefined()
    expect(fileName.category).toBe('Merge Tags')
  })
})
