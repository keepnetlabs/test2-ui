import surveyCoverImageUrl from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/surveyCoverImageUrl'

describe('GrapesJs mergedTextsBlocks surveyCoverImageUrl', () => {
  it('exports default array with block structure', () => {
    expect(Array.isArray(surveyCoverImageUrl)).toBe(true)
    expect(surveyCoverImageUrl[0]).toBeDefined()
  })
})
