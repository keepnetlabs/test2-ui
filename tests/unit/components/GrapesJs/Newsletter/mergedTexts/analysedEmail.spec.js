import analysedEmail from '@/components/GrapesJs/Newsletter/mergedTexts/analysedEmail'

describe('GrapesJs mergedTexts analysedEmail', () => {
  it('exports default with label and category', () => {
    expect(analysedEmail.label).toBeDefined()
    expect(analysedEmail.category).toBe('Merge Tags')
  })
})
