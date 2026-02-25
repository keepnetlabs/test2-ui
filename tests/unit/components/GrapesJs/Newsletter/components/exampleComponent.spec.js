import exampleComponent from '@/components/GrapesJs/Newsletter/components/exampleComponent'

describe('GrapesJs components exampleComponent', () => {
  it('exports default with label and category', () => {
    expect(exampleComponent.label).toBe('Custom Div POC')
    expect(exampleComponent.category).toBe('Custom Components')
  })

  it('has content with tagName and components', () => {
    expect(exampleComponent.content.tagName).toBe('div')
    expect(exampleComponent.content).toHaveProperty('components')
  })
})
