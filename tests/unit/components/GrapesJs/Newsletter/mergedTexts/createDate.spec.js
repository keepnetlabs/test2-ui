import createDate from '@/components/GrapesJs/Newsletter/mergedTexts/createDate'

describe('GrapesJs mergedTexts createDate', () => {
  it('exports default with label and category', () => {
    expect(createDate.label).toBeDefined()
    expect(createDate.category).toBe('Merge Tags')
  })
})
