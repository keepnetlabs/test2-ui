import postUserName from '@/components/GrapesJs/Newsletter/mergedTexts/postUserName'

describe('GrapesJs mergedTexts postUserName', () => {
  it('exports default with label and category', () => {
    expect(postUserName.label).toBeDefined()
    expect(postUserName.category).toBe('Merge Tags')
  })
})
