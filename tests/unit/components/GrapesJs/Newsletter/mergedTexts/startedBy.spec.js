import startedBy from '@/components/GrapesJs/Newsletter/mergedTexts/startedBy'

describe('GrapesJs mergedTexts startedBy', () => {
  it('exports default with label and category', () => {
    expect(startedBy.label).toBeDefined()
    expect(startedBy.category).toBe('Merge Tags')
  })
})
