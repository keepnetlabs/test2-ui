import trainingUrl from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/trainingUrl'

describe('GrapesJs mergedTextsBlocks trainingUrl', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(trainingUrl)).toBe(true)
    expect(trainingUrl[0]).toHaveProperty('tagName')
    expect(trainingUrl[0]).toHaveProperty('content')
  })
})
