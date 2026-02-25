import amazonTemplate from '@/components/GrapesJs/Newsletter/components/amazonTemplate'

describe('GrapesJs components amazonTemplate', () => {
  it('exports default with label and category', () => {
    expect(amazonTemplate.label).toBe('Amazon')
    expect(amazonTemplate.category).toBe('Custom Components')
  })

  it('has content with tagName and components', () => {
    expect(amazonTemplate.content.tagName).toBe('div')
    expect(amazonTemplate.content).toHaveProperty('components')
  })
})
