import status from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/status'
import status2 from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/status2'

describe('GrapesJs mergedTextsBlocks status', () => {
  it('status exports default array with tagName and content', () => {
    expect(Array.isArray(status)).toBe(true)
    expect(status[0]).toHaveProperty('tagName')
    expect(status[0]).toHaveProperty('content')
  })

  it('status2 exports default array with tagName and content', () => {
    expect(Array.isArray(status2)).toBe(true)
    expect(status2[0]).toHaveProperty('tagName')
    expect(status2[0]).toHaveProperty('content')
  })
})
