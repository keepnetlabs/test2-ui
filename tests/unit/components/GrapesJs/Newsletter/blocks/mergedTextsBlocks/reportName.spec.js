import reportName from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/reportName'

describe('GrapesJs mergedTextsBlocks reportName', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(reportName)).toBe(true)
    expect(reportName[0]).toHaveProperty('tagName')
    expect(reportName[0]).toHaveProperty('content')
  })
})
