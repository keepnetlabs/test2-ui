import attachment from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/attachment'

describe('GrapesJs mergedTextsBlocks attachment', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(attachment)).toBe(true)
    expect(attachment[0]).toHaveProperty('tagName')
    expect(attachment[0]).toHaveProperty('content')
  })
})
