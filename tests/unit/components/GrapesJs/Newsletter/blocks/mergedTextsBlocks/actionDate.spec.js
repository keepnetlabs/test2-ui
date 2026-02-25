import actionDate from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/actionDate'

describe('GrapesJs mergedTextsBlocks actionDate', () => {
  it('exports default array with span and content', () => {
    expect(Array.isArray(actionDate)).toBe(true)
    expect(actionDate[0].tagName).toBe('span')
    expect(actionDate[0].content).toBe('{ACTIONDATE}')
  })
})
