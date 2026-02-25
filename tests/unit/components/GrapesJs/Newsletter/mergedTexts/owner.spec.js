import owner from '@/components/GrapesJs/Newsletter/mergedTexts/owner'

describe('GrapesJs mergedTexts owner', () => {
  it('exports default with label and category', () => {
    expect(owner.label).toBeDefined()
    expect(owner.category).toBe('Merge Tags')
  })
})
