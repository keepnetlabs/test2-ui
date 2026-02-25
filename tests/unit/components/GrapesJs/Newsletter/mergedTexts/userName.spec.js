import userName from '@/components/GrapesJs/Newsletter/mergedTexts/userName'
import userName2 from '@/components/GrapesJs/Newsletter/mergedTexts/userName2'

describe('GrapesJs mergedTexts userName', () => {
  it('userName exports default with label and category', () => {
    expect(userName.label).toBe('User Name')
    expect(userName.category).toBe('Merge Tags')
  })

  it('userName has content with tagName', () => {
    expect(userName.content.tagName).toBe('span')
    expect(userName.content.draggable).toBe(true)
  })

  it('userName2 exports default with label and category', () => {
    expect(userName2.label).toBeDefined()
    expect(userName2.category).toBe('Merge Tags')
  })
})
