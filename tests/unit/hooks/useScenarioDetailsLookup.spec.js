import useScenarioDetailsLookup from '@/hooks/useScenarioDetailsLookup'
import { getScenarioDataDetails } from '@/api/scenarios'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'

jest.mock('@/api/scenarios', () => ({
  getScenarioDataDetails: jest.fn()
}))

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  getSingle: jest.fn()
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('useScenarioDetailsLookup hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps language names from lookup response and sets scenarioDetailsLookup', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce([
      { isoFriendlyName: 'English', resourceId: 'en' },
      { isoFriendlyName: 'Turkish', resourceId: 'tr' }
    ])
    getScenarioDataDetails.mockResolvedValueOnce({
      data: {
        data: {
          methodTypes: [],
          difficultyTypes: [],
          languageTypes: [{ value: 'en', text: 'EN' }],
          preferredLanguageTypes: [{ value: 'tr', text: 'TR' }]
        }
      }
    })

    const ctx = { scenarioDetailsLookup: null }
    useScenarioDetailsLookup.methods.callForScenarioDetails.call(ctx)
    await flushPromises()
    await flushPromises()

    expect(LookupLocalStorage.getSingle).toHaveBeenCalledWith(21)
    expect(getScenarioDataDetails).toHaveBeenCalled()
    expect(ctx.scenarioDetailsLookup.languageTypes[0].text).toBe('English')
    expect(ctx.scenarioDetailsLookup.preferredLanguageTypes[0].text).toBe('Turkish')
  })

  it('falls back to default structure when api payload is missing', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce([])
    getScenarioDataDetails.mockResolvedValueOnce({ data: {} })

    const ctx = { scenarioDetailsLookup: null }
    useScenarioDetailsLookup.methods.callForScenarioDetails.call(ctx)
    await flushPromises()
    await flushPromises()

    expect(ctx.scenarioDetailsLookup).toEqual({
      methodTypes: [],
      difficultyTypes: [],
      languageTypes: [],
      preferredLanguageTypes: [],
      companyLanguageTypeResourceId: ''
    })
  })
})
