import link from '@/components/GrapesJs/Newsletter/mergedTexts/link'

describe('GrapesJs mergedTexts link', () => {
  it('exports default with label and category', () => {
    expect(link.label).toBeDefined()
    expect(link.category).toBe('Merge Tags')
  })
})
