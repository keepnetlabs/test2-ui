import senderEmail from '@/components/GrapesJs/Newsletter/mergedTexts/senderEmail'

describe('GrapesJs mergedTexts senderEmail', () => {
  it('exports default with label and category', () => {
    expect(senderEmail.label).toBeDefined()
    expect(senderEmail.category).toBe('Merge Tags')
  })
})
