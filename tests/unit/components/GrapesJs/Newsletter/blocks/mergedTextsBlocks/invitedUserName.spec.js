import invitedUserName from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/invitedUserName'

describe('GrapesJs mergedTextsBlocks invitedUserName', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(invitedUserName)).toBe(true)
    expect(invitedUserName[0]).toHaveProperty('tagName')
    expect(invitedUserName[0]).toHaveProperty('content')
  })
})
