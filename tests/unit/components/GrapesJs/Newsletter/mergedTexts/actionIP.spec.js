import actionIP from '@/components/GrapesJs/Newsletter/mergedTexts/actionIP'

describe('GrapesJs mergedTexts actionIP', () => {
  it('exports default with label and category', () => {
    expect(actionIP.label).toBeDefined()
    expect(actionIP.category).toBe('Merge Tags')
  })
})
