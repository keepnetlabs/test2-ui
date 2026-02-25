import dateSent from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/dateSent'

describe('GrapesJs mergedTextsBlocks dateSent', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(dateSent)).toBe(true)
    expect(dateSent[0]).toHaveProperty('tagName')
    expect(dateSent[0]).toHaveProperty('content')
  })
})
