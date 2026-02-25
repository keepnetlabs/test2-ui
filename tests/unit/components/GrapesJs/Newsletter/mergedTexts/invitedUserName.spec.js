import invitedUserName from '@/components/GrapesJs/Newsletter/mergedTexts/invitedUserName'

describe('GrapesJs mergedTexts invitedUserName', () => {
  it('exports default with label and category', () => {
    expect(invitedUserName.label).toBeDefined()
    expect(invitedUserName.category).toBe('Merge Tags')
  })
})
