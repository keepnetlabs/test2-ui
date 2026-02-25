import foundEmailCount from '@/components/GrapesJs/Newsletter/mergedTexts/foundEmailCount'

describe('GrapesJs mergedTexts foundEmailCount', () => {
  it('exports default with label and category', () => {
    expect(foundEmailCount.label).toBeDefined()
    expect(foundEmailCount.category).toBe('Merge Tags')
  })
})
