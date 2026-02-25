import invitedByCompanyName from '@/components/GrapesJs/Newsletter/mergedTexts/invitedByCompanyName'

describe('GrapesJs mergedTexts invitedByCompanyName', () => {
  it('exports default with label and category', () => {
    expect(invitedByCompanyName.label).toBeDefined()
    expect(invitedByCompanyName.category).toBe('Merge Tags')
  })
})
