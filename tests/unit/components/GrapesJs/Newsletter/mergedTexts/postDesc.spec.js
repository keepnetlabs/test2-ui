import postDesc from '@/components/GrapesJs/Newsletter/mergedTexts/postDesc'

describe('GrapesJs mergedTexts postDesc', () => {
  it('exports default with label and category', () => {
    expect(postDesc.label).toBeDefined()
    expect(postDesc.category).toBe('Merge Tags')
  })
})
