import userEmail from '@/components/GrapesJs/Newsletter/mergedTexts/userEmail'

describe('GrapesJs mergedTexts userEmail', () => {
  it('exports default with label and category', () => {
    expect(userEmail.label).toBeDefined()
    expect(userEmail.category).toBe('Merge Tags')
  })
})
