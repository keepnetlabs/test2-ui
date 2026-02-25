import companyLogo from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/companyLogo'

describe('GrapesJs mergedTextsBlocks companyLogo', () => {
  it('exports default array with logo block structure', () => {
    expect(Array.isArray(companyLogo)).toBe(true)
    expect(companyLogo[0]).toHaveProperty('src')
    expect(companyLogo[0]).toHaveProperty('id')
  })
})
