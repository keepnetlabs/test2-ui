import senderEmail from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/senderEmail'

describe('GrapesJs mergedTextsBlocks senderEmail', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(senderEmail)).toBe(true)
    expect(senderEmail[0]).toHaveProperty('tagName')
    expect(senderEmail[0]).toHaveProperty('content')
  })
})
