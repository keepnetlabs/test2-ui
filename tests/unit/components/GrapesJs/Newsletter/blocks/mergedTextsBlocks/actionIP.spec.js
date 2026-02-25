import actionIP from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/actionIP'

describe('GrapesJs mergedTextsBlocks actionIP', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(actionIP)).toBe(true)
    expect(actionIP[0]).toHaveProperty('tagName')
    expect(actionIP[0]).toHaveProperty('content')
  })
})
