import enrollmentName from '@/components/GrapesJs/Newsletter/mergedTexts/enrollmentName'

describe('GrapesJs mergedTexts enrollmentName', () => {
  it('exports default with label and category', () => {
    expect(enrollmentName.label).toBeDefined()
    expect(enrollmentName.category).toBe('Merge Tags')
  })
})
