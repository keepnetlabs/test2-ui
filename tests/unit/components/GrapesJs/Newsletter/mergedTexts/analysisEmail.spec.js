import analysisEmail from '@/components/GrapesJs/Newsletter/mergedTexts/analysisEmail'

describe('GrapesJs mergedTexts analysisEmail', () => {
  it('exports default with label and category', () => {
    expect(analysisEmail.label).toBeDefined()
    expect(analysisEmail.category).toBe('Merge Tags')
  })
})
