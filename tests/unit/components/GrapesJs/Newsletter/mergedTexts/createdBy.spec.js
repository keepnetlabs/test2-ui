import createdBy from '@/components/GrapesJs/Newsletter/mergedTexts/createdBy'

describe('GrapesJs mergedTexts createdBy', () => {
  it('exports default with label and category', () => {
    expect(createdBy.label).toBeDefined()
    expect(createdBy.category).toBe('Merge Tags')
  })
})
