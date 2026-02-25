import activeUsers from '@/components/GrapesJs/Newsletter/mergedTexts/activeUsers'

describe('GrapesJs mergedTexts activeUsers', () => {
  it('exports default with label and category', () => {
    expect(activeUsers.label).toBeDefined()
    expect(activeUsers.category).toBe('Merge Tags')
  })
})
