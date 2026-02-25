import lastName from '@/components/GrapesJs/Newsletter/mergedTexts/lastName'

describe('GrapesJs mergedTexts lastName', () => {
  it('exports default with label Last Name', () => {
    expect(lastName.label).toBe('Last Name')
    expect(lastName.category).toBe('Merge Tags')
  })
})
