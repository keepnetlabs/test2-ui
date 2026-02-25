import outlookButton from '@/components/GrapesJs/Newsletter/components/outlookButton'

describe('GrapesJs components outlookButton', () => {
  it('exports default with label and category', () => {
    expect(outlookButton.label).toBe('Button')
    expect(outlookButton.category).toBe('Basic')
  })

  it('has content string', () => {
    expect(typeof outlookButton.content).toBe('string')
    expect(outlookButton.content).toContain('Button')
  })
})
