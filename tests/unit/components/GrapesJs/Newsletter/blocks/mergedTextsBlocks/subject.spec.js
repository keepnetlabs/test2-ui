import subject from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/subject'

describe('GrapesJs mergedTextsBlocks subject', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(subject)).toBe(true)
    expect(subject[0]).toHaveProperty('tagName')
    expect(subject[0]).toHaveProperty('content')
  })
})
