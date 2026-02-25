import shareUserName from '@/components/GrapesJs/Newsletter/mergedTexts/shareUserName'

describe('GrapesJs mergedTexts shareUserName', () => {
  it('exports default with label and category', () => {
    expect(shareUserName.label).toBeDefined()
    expect(shareUserName.category).toBe('Merge Tags')
  })
})
