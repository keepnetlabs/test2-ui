import status from '@/components/GrapesJs/Newsletter/mergedTexts/status'
import status2 from '@/components/GrapesJs/Newsletter/mergedTexts/status2'

describe('GrapesJs mergedTexts status', () => {
  it('status (investigation) exports default with label and category', () => {
    expect(status.label).toBeDefined()
    expect(status.category).toBe('Merge Tags')
  })

  it('status2 (generic) exports default with label and category', () => {
    expect(status2.label).toBeDefined()
    expect(status2.category).toBe('Merge Tags')
  })
})
