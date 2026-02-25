import NumericComponent from '@/components/AwarenessEducator/TrainingReport/Users/NumericComponent.vue'

describe('NumericComponent.vue', () => {
  it('has correct component name', () => {
    expect(NumericComponent.name).toBe('NumericComponent')
  })

  it('getUserAnswer returns fallback when answerOptions is empty', () => {
    expect(NumericComponent.computed.getUserAnswer.call({ answerOptions: [] })).toBe(
      'No answer provided'
    )
  })

  it('getUserAnswer prioritizes text then option', () => {
    expect(
      NumericComponent.computed.getUserAnswer.call({
        answerOptions: [{ text: '42', option: '41' }]
      })
    ).toBe('42')
    expect(
      NumericComponent.computed.getUserAnswer.call({
        answerOptions: [{ option: '41' }]
      })
    ).toBe('41')
  })
})
