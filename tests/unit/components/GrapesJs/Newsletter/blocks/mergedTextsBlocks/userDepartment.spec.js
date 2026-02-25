import userDepartment from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/userDepartment'

describe('GrapesJs mergedTextsBlocks userDepartment', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(userDepartment)).toBe(true)
    expect(userDepartment[0]).toHaveProperty('tagName')
    expect(userDepartment[0]).toHaveProperty('content')
  })
})
