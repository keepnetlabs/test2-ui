import email from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/email'

describe('GrapesJs mergedTextsBlocks email', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(email)).toBe(true)
    expect(email[0]).toHaveProperty('tagName')
    expect(email[0]).toHaveProperty('content')
  })
})
