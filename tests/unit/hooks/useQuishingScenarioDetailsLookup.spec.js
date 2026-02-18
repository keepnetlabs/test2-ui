import useQuishingScenarioDetailsLookup from '@/hooks/useQuishingScenarioDetailsLookup'
import QuishingService from '@/api/quishing'

jest.mock('@/api/quishing', () => ({
  getScenarioDataDetails: jest.fn()
}))

describe('useQuishingScenarioDetailsLookup hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('sets scenarioDetailsLookup from service response', async () => {
    QuishingService.getScenarioDataDetails.mockResolvedValueOnce({
      data: {
        data: {
          methodTypes: [{ text: 'Click', value: '1' }],
          difficultyTypes: [{ text: 'Low', value: '1' }]
        }
      }
    })

    const ctx = { scenarioDetailsLookup: null }
    await useQuishingScenarioDetailsLookup.methods.callForScenarioDetails.call(ctx)

    expect(QuishingService.getScenarioDataDetails).toHaveBeenCalled()
    expect(ctx.scenarioDetailsLookup.methodTypes).toHaveLength(1)
    expect(ctx.scenarioDetailsLookup.difficultyTypes).toHaveLength(1)
  })

  it('uses defaults when response data is missing', async () => {
    QuishingService.getScenarioDataDetails.mockResolvedValueOnce({ data: {} })

    const ctx = { scenarioDetailsLookup: null }
    await useQuishingScenarioDetailsLookup.methods.callForScenarioDetails.call(ctx)

    expect(ctx.scenarioDetailsLookup).toEqual({
      methodTypes: [],
      difficultyTypes: []
    })
  })
})
