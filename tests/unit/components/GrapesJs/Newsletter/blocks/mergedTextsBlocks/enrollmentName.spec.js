import enrollmentName from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/enrollmentName'

describe('GrapesJs mergedTextsBlocks enrollmentName', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(enrollmentName)).toBe(true)
    expect(enrollmentName[0]).toHaveProperty('tagName')
    expect(enrollmentName[0]).toHaveProperty('content')
  })
})
