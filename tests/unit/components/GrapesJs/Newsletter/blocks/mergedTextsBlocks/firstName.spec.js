import firstName from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/firstName'

describe('GrapesJs mergedTextsBlocks firstName', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(firstName)).toBe(true)
    expect(firstName[0]).toHaveProperty('tagName')
    expect(firstName[0]).toHaveProperty('content')
  })
})
