import macroForm from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/macroForm'

describe('GrapesJs mergedTextsBlocks macroForm', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(macroForm)).toBe(true)
    expect(macroForm[0]).toHaveProperty('tagName')
    expect(macroForm[0]).toHaveProperty('content')
  })
})
