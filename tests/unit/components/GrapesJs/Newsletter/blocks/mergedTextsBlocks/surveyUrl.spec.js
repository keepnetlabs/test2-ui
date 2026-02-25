import surveyUrl from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/surveyUrl'

describe('GrapesJs mergedTextsBlocks surveyUrl', () => {
  it('exports default array with block structure', () => {
    expect(Array.isArray(surveyUrl)).toBe(true)
    expect(surveyUrl[0]).toBeDefined()
  })
})
