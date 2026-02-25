import senderIP from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/senderIP'

describe('GrapesJs mergedTextsBlocks senderIP', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(senderIP)).toBe(true)
    expect(senderIP[0]).toHaveProperty('tagName')
    expect(senderIP[0]).toHaveProperty('content')
  })
})
