import MatchingComponent from '@/components/AwarenessEducator/TrainingReport/Users/MatchingComponent.vue'

describe('MatchingComponent', () => {
  it('returns empty array when answerOptions is empty', () => {
    const result = MatchingComponent.computed.userMatches.call({
      answerOptions: []
    })

    expect(result).toEqual([])
  })

  it('maps only user answers and parses left/right values', () => {
    const result = MatchingComponent.computed.userMatches.call({
      answerOptions: [
        { isUserAnswer: false, text: 'Ignored -> Value' },
        { isUserAnswer: true, text: 'Item A → Match A' },
        { isUserAnswer: true, text: 'Item B' }
      ]
    })

    expect(result).toEqual([
      { left: 'Item A', right: 'Match A' },
      { left: 'Item B', right: '' }
    ])
  })

  it('supports option fallback fields', () => {
    const result = MatchingComponent.computed.userMatches.call({
      answerOptions: [{ isUserAnswer: true, option: 'Left → Right' }]
    })

    expect(result).toEqual([{ left: 'Left', right: 'Right' }])
  })
})
