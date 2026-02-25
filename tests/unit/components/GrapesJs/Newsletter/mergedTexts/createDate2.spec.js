import createDate2 from '@/components/GrapesJs/Newsletter/mergedTexts/createDate2'

describe('GrapesJs mergedTexts createDate2', () => {
  it('exports default with label and category', () => {
    expect(createDate2.label).toBeDefined()
    expect(createDate2.category).toBe('Merge Tags')
  })
})
