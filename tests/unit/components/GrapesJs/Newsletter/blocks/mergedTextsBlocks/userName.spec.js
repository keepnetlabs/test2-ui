import userName from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/userName'
import userName2 from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/userName2'

describe('GrapesJs mergedTextsBlocks userName', () => {
  it('userName exports default array with tagName and content', () => {
    expect(Array.isArray(userName)).toBe(true)
    expect(userName[0]).toHaveProperty('tagName')
    expect(userName[0]).toHaveProperty('content')
  })

  it('userName2 exports default array with tagName and content', () => {
    expect(Array.isArray(userName2)).toBe(true)
    expect(userName2[0]).toHaveProperty('tagName')
    expect(userName2[0]).toHaveProperty('content')
  })
})
