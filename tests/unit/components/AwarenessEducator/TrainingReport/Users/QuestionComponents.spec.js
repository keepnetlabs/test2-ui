import FillInComponent from '@/components/AwarenessEducator/TrainingReport/Users/FillInComponent.vue'
import NumericComponent from '@/components/AwarenessEducator/TrainingReport/Users/NumericComponent.vue'
import SequenceComponent from '@/components/AwarenessEducator/TrainingReport/Users/SequenceComponent.vue'
import WordBankComponent from '@/components/AwarenessEducator/TrainingReport/Users/WordBankComponent.vue'
import DropdownComponent from '@/components/AwarenessEducator/TrainingReport/Users/DropdownComponent.vue'

describe('TrainingReport question components', () => {
  it('FillInComponent returns fallback and text values', () => {
    expect(FillInComponent.computed.getUserAnswer.call({ answerOptions: [] })).toBe(
      'No answer provided'
    )
    expect(
      FillInComponent.computed.getUserAnswer.call({
        answerOptions: [{ text: 'Answer A' }]
      })
    ).toBe('Answer A')
  })

  it('NumericComponent returns fallback and option values', () => {
    expect(NumericComponent.computed.getUserAnswer.call({ answerOptions: null })).toBe(
      'No answer provided'
    )
    expect(
      NumericComponent.computed.getUserAnswer.call({
        answerOptions: [{ option: '42' }]
      })
    ).toBe('42')
  })

  it('SequenceComponent maps sequence in order', () => {
    expect(SequenceComponent.computed.userSequence.call({ answerOptions: [] })).toEqual([])
    expect(
      SequenceComponent.computed.userSequence.call({
        answerOptions: [{ text: 'First' }, { option: 'Second' }, { answer: 'Third' }]
      })
    ).toEqual(['First', 'Second', 'Third'])
  })

  it('WordBankComponent filters user answers and returns ordinals', () => {
    expect(WordBankComponent.computed.userWords.call({ answerOptions: [] })).toEqual([])
    expect(
      WordBankComponent.computed.userWords.call({
        answerOptions: [
          { isUserAnswer: false, text: 'ignore' },
          { isUserAnswer: true, text: 'hello' },
          { isUserAnswer: true, option: 'world' }
        ]
      })
    ).toEqual(['hello', 'world'])

    expect(WordBankComponent.methods.getOrdinalNumber(1)).toBe('1st')
    expect(WordBankComponent.methods.getOrdinalNumber(2)).toBe('2nd')
    expect(WordBankComponent.methods.getOrdinalNumber(3)).toBe('3rd')
    expect(WordBankComponent.methods.getOrdinalNumber(4)).toBe('4th')
  })

  it('DropdownComponent returns user selection or fallback', () => {
    expect(DropdownComponent.computed.getUserSelection.call({ answerOptions: [] })).toBe(
      'No selection made'
    )
    expect(
      DropdownComponent.computed.getUserSelection.call({
        answerOptions: [
          { isUserAnswer: false, text: 'A' },
          { isUserAnswer: true, answer: 'B' }
        ]
      })
    ).toBe('B')
  })
})
