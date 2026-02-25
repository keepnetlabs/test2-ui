import userAgent from '@/components/GrapesJs/Newsletter/mergedTexts/userAgent'

describe('GrapesJs mergedTexts userAgent', () => {
  it('exports default with label and category', () => {
    expect(userAgent.label).toBeDefined()
    expect(userAgent.category).toBe('Merge Tags')
  })
})
