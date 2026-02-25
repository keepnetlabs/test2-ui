import dateEmailSent from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/dateEmailSent'

describe('GrapesJs mergedTextsBlocks dateEmailSent', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(dateEmailSent)).toBe(true)
    expect(dateEmailSent[0]).toHaveProperty('tagName')
    expect(dateEmailSent[0]).toHaveProperty('content')
  })
})
