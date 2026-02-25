import dateSent from '@/components/GrapesJs/Newsletter/mergedTexts/dateSent'

describe('GrapesJs mergedTexts dateSent', () => {
  it('exports default with label and category', () => {
    expect(dateSent.label).toBeDefined()
    expect(dateSent.category).toBe('Merge Tags')
  })
})
