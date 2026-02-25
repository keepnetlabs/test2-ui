import caseID from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/caseID'

describe('GrapesJs mergedTextsBlocks caseID', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(caseID)).toBe(true)
    expect(caseID[0]).toHaveProperty('tagName')
    expect(caseID[0]).toHaveProperty('content')
  })
})
