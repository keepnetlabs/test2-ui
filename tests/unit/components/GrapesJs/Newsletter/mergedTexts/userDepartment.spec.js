import userDepartment from '@/components/GrapesJs/Newsletter/mergedTexts/userDepartment'

describe('GrapesJs mergedTexts userDepartment', () => {
  it('exports default with label and category', () => {
    expect(userDepartment.label).toBeDefined()
    expect(userDepartment.category).toBe('Merge Tags')
  })
})
