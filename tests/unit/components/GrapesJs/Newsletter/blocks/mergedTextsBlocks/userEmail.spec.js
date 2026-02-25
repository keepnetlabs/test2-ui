import userEmail from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/userEmail'

describe('GrapesJs mergedTextsBlocks userEmail', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(userEmail)).toBe(true)
    expect(userEmail[0]).toHaveProperty('tagName')
    expect(userEmail[0]).toHaveProperty('content')
  })
})
