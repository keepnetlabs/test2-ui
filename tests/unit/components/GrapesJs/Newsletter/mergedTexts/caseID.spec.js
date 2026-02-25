import caseID from '@/components/GrapesJs/Newsletter/mergedTexts/caseID'

describe('GrapesJs mergedTexts caseID', () => {
  it('exports default with label and category', () => {
    expect(caseID.label).toBeDefined()
    expect(caseID.category).toBe('Merge Tags')
  })
})
