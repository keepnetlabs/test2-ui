import postDate from '@/components/GrapesJs/Newsletter/mergedTexts/postDate'

describe('GrapesJs mergedTexts postDate', () => {
  it('exports default with label and category', () => {
    expect(postDate.label).toBeDefined()
    expect(postDate.category).toBe('Merge Tags')
  })
})
