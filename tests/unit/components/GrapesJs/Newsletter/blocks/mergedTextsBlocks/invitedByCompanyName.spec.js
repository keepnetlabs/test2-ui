import invitedByCompanyName from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/invitedByCompanyName'

describe('GrapesJs mergedTextsBlocks invitedByCompanyName', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(invitedByCompanyName)).toBe(true)
    expect(invitedByCompanyName[0]).toHaveProperty('tagName')
    expect(invitedByCompanyName[0]).toHaveProperty('content')
  })
})
