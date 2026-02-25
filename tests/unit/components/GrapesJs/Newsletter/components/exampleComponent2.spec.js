import exampleComponent2 from '@/components/GrapesJs/Newsletter/components/exampleComponent2'

describe('GrapesJs components exampleComponent2', () => {
  it('exports default with label and category', () => {
    expect(exampleComponent2.label).toBeDefined()
    expect(exampleComponent2.category).toBeDefined()
  })
})
