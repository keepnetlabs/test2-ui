import passwordURL from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/passwordURL'

describe('GrapesJs mergedTextsBlocks passwordURL', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(passwordURL)).toBe(true)
    expect(passwordURL[0]).toHaveProperty('tagName')
    expect(passwordURL[0]).toHaveProperty('content')
  })
})
