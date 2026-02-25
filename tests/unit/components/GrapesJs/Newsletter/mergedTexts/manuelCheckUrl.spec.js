import manuelCheckUrl from '@/components/GrapesJs/Newsletter/mergedTexts/manuelCheckUrl'

describe('GrapesJs mergedTexts manuelCheckUrl', () => {
  it('exports default with label and category', () => {
    expect(manuelCheckUrl.label).toBeDefined()
    expect(manuelCheckUrl.category).toBe('Merge Tags')
  })
})
