import reportName from '@/components/GrapesJs/Newsletter/mergedTexts/reportName'

describe('GrapesJs mergedTexts reportName', () => {
  it('exports default with label and category', () => {
    expect(reportName.label).toBeDefined()
    expect(reportName.category).toBe('Merge Tags')
  })
})
