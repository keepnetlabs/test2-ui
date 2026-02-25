import userName from '@/components/GrapesJs/Newsletter/mergedTexts/userName'

describe('GrapesJs mergedTexts userName', () => {
  it('exports default with label and category', () => {
    expect(userName.label).toBe('User Name')
    expect(userName.category).toBe('Merge Tags')
  })

  it('has content with tagName', () => {
    expect(userName.content.tagName).toBe('span')
    expect(userName.content.draggable).toBe(true)
  })
})
