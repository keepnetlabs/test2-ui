import trainingCoverImageUrl from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/trainingCoverImageUrl'

describe('GrapesJs mergedTextsBlocks trainingCoverImageUrl', () => {
  it('exports default array with block structure', () => {
    expect(Array.isArray(trainingCoverImageUrl)).toBe(true)
    expect(trainingCoverImageUrl[0]).toBeDefined()
  })
})
