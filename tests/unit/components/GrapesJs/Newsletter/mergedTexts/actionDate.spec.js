import actionDate from '@/components/GrapesJs/Newsletter/mergedTexts/actionDate'

describe('GrapesJs mergedTexts actionDate', () => {
  it('exports default with label and category', () => {
    expect(actionDate.label).toBeDefined()
    expect(actionDate.category).toBe('Merge Tags')
  })
})
