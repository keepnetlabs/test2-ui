import fullName from '@/components/GrapesJs/Newsletter/mergedTexts/fullName'

describe('GrapesJs mergedTexts fullName', () => {
  it('exports default with label and category', () => {
    expect(fullName.label).toBeDefined()
    expect(fullName.category).toBe('Merge Tags')
  })
})
