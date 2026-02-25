import trainingEnrollDate from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/trainingEnrollDate'

describe('GrapesJs mergedTextsBlocks trainingEnrollDate', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(trainingEnrollDate)).toBe(true)
    expect(trainingEnrollDate[0]).toHaveProperty('tagName')
    expect(trainingEnrollDate[0]).toHaveProperty('content')
  })
})
