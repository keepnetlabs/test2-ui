import postTitle from '@/components/GrapesJs/Newsletter/mergedTexts/postTitle'

describe('GrapesJs mergedTexts postTitle', () => {
  it('exports default with label and category', () => {
    expect(postTitle.label).toBeDefined()
    expect(postTitle.category).toBe('Merge Tags')
  })
})
