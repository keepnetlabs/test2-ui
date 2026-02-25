import submitButton from '@/components/GrapesJs/Newsletter/components/submitButton'

describe('GrapesJs components submitButton', () => {
  it('exports default with label and category', () => {
    expect(submitButton.label).toBeDefined()
    expect(submitButton.category).toBeDefined()
  })
})
