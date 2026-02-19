import { callbackScenariosDifficultyTypes } from '@/components/CallbackScenarios/utils'

describe('CallbackScenarios utils', () => {
  it('exports difficulty types', () => {
    expect(callbackScenariosDifficultyTypes).toEqual([
      { text: 'Easy', value: 1 },
      { text: 'Medium', value: 2 },
      { text: 'Hard', value: 3 }
    ])
  })
})
