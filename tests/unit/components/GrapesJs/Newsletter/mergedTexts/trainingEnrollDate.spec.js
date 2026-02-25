import trainingEnrollDate from '@/components/GrapesJs/Newsletter/mergedTexts/trainingEnrollDate'

describe('GrapesJs mergedTexts trainingEnrollDate', () => {
  it('exports default with label and category', () => {
    expect(trainingEnrollDate.label).toBeDefined()
    expect(trainingEnrollDate.category).toBe('Merge Tags')
  })
})
