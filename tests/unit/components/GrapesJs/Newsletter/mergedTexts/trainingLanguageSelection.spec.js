import trainingLanguageSelection from '@/components/GrapesJs/Newsletter/mergedTexts/trainingLanguageSelection'

describe('GrapesJs mergedTexts trainingLanguageSelection', () => {
  it('exports default with label and category', () => {
    expect(trainingLanguageSelection.label).toBeDefined()
    expect(trainingLanguageSelection.category).toBe('Merge Tags')
  })
})
