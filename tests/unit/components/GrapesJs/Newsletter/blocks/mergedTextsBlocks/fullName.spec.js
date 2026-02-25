import fullName from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/fullName'

describe('GrapesJs mergedTextsBlocks fullName', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(fullName)).toBe(true)
    expect(fullName[0]).toHaveProperty('tagName')
    expect(fullName[0]).toHaveProperty('content')
  })
})
