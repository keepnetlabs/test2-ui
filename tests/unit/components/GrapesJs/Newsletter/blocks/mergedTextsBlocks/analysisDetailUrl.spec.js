import analysisDetailUrl from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/analysisDetailUrl'

describe('GrapesJs mergedTextsBlocks analysisDetailUrl', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(analysisDetailUrl)).toBe(true)
    expect(analysisDetailUrl[0]).toHaveProperty('tagName')
    expect(analysisDetailUrl[0]).toHaveProperty('content')
  })
})
