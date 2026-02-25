import firstName from '@/components/GrapesJs/Newsletter/mergedTexts/firstName'

describe('GrapesJs mergedTexts firstName', () => {
  it('exports default with label First Name', () => {
    expect(firstName.label).toBe('First Name')
    expect(firstName.category).toBe('Merge Tags')
  })
})
