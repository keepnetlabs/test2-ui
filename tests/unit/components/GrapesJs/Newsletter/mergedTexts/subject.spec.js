import subject from '@/components/GrapesJs/Newsletter/mergedTexts/subject'

describe('GrapesJs mergedTexts subject', () => {
  it('exports default with label Subject', () => {
    expect(subject.label).toBe('Subject')
    expect(subject.category).toBe('Merge Tags')
  })
})
