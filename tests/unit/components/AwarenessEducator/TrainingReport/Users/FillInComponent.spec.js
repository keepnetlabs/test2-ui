import FillInComponent from '@/components/AwarenessEducator/TrainingReport/Users/FillInComponent.vue'

describe('FillInComponent.vue', () => {
  it('has correct component name', () => {
    expect(FillInComponent.name).toBe('FillInComponent')
  })

  it('getUserAnswer returns fallback when answerOptions is empty', () => {
    expect(FillInComponent.computed.getUserAnswer.call({ answerOptions: [] })).toBe(
      'No answer provided'
    )
  })

  it('getUserAnswer prioritizes text then option', () => {
    expect(
      FillInComponent.computed.getUserAnswer.call({
        answerOptions: [{ text: 'Answer Text', option: 'Option Text' }]
      })
    ).toBe('Answer Text')
    expect(
      FillInComponent.computed.getUserAnswer.call({
        answerOptions: [{ option: 'Option Text' }]
      })
    ).toBe('Option Text')
  })
})
