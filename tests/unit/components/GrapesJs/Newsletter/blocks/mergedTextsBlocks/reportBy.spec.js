import reportBy from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/reportBy'

describe('GrapesJs mergedTextsBlocks reportBy', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(reportBy)).toBe(true)
    expect(reportBy[0]).toHaveProperty('tagName')
    expect(reportBy[0]).toHaveProperty('content')
  })
})
