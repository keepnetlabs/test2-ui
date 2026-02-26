import useQuishingScenarioDetailsLookup from '@/hooks/useQuishingScenarioDetailsLookup'
import QuishingService from '@/api/quishing'
import { getScenarioDataDetails } from '@/api/scenarios'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'

jest.mock('@/api/quishing', () => ({
  getScenarioDataDetails: jest.fn()
}))

jest.mock('@/api/scenarios', () => ({
  getScenarioDataDetails: jest.fn()
}))

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  getSingle: jest.fn()
}))

describe('useQuishingScenarioDetailsLookup hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('data() returns expected initial state', () => {
    expect(useQuishingScenarioDetailsLookup.data()).toEqual({
      scenarioDetailsLookup: null
    })
  })

  it('sets scenarioDetailsLookup by merging quishing data and mapped preferred languages', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce([
      { isoFriendlyName: 'English', name: 'English', resourceId: 'lang-en' },
      { isoFriendlyName: 'Turkish', name: 'Turkish', resourceId: 'lang-tr' }
    ])
    QuishingService.getScenarioDataDetails.mockResolvedValueOnce({
      data: {
        data: {
          methodTypes: [{ text: 'Click', value: '1' }],
          difficultyTypes: [{ text: 'Low', value: '1' }]
        }
      }
    })
    getScenarioDataDetails.mockResolvedValueOnce({
      data: {
        data: {
          preferredLanguageTypes: [
            { value: 'lang-en', text: '' },
            { value: 'lang-tr', text: '' }
          ]
        }
      }
    })

    const ctx = { scenarioDetailsLookup: null }
    const result = await useQuishingScenarioDetailsLookup.methods.callForScenarioDetails.call(ctx)

    expect(LookupLocalStorage.getSingle).toHaveBeenCalledWith(21)
    expect(QuishingService.getScenarioDataDetails).toHaveBeenCalled()
    expect(getScenarioDataDetails).toHaveBeenCalled()
    expect(ctx.scenarioDetailsLookup.methodTypes).toHaveLength(1)
    expect(ctx.scenarioDetailsLookup.difficultyTypes).toHaveLength(1)
    expect(ctx.scenarioDetailsLookup.preferredLanguageTypes).toEqual([
      { value: 'lang-en', text: 'English' },
      { value: 'lang-tr', text: 'Turkish' }
    ])
    expect(result).toEqual(
      expect.objectContaining({
        data: expect.any(Object)
      })
    )
  })

  it('uses defaults when quishing response data is missing', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce([])
    QuishingService.getScenarioDataDetails.mockResolvedValueOnce({ data: {} })
    getScenarioDataDetails.mockResolvedValueOnce({
      data: { data: { preferredLanguageTypes: [] } }
    })

    const ctx = { scenarioDetailsLookup: null }
    await useQuishingScenarioDetailsLookup.methods.callForScenarioDetails.call(ctx)

    expect(ctx.scenarioDetailsLookup).toEqual({
      methodTypes: [],
      difficultyTypes: [],
      preferredLanguageTypes: []
    })
  })

  it('falls back to language name when isoFriendlyName is missing', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce([
      { name: 'German', resourceId: 'lang-de' }
    ])
    QuishingService.getScenarioDataDetails.mockResolvedValueOnce({
      data: { data: { methodTypes: [], difficultyTypes: [] } }
    })
    getScenarioDataDetails.mockResolvedValueOnce({
      data: { data: { preferredLanguageTypes: [{ value: 'lang-de', text: '' }] } }
    })

    const ctx = { scenarioDetailsLookup: null }
    await useQuishingScenarioDetailsLookup.methods.callForScenarioDetails.call(ctx)

    expect(ctx.scenarioDetailsLookup.preferredLanguageTypes).toEqual([
      { value: 'lang-de', text: 'German' }
    ])
  })

  it('keeps preferred language text when lookup option is not found', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce([
      { isoFriendlyName: 'English', name: 'English', resourceId: 'lang-en' }
    ])
    QuishingService.getScenarioDataDetails.mockResolvedValueOnce({
      data: { data: { methodTypes: [], difficultyTypes: [] } }
    })
    getScenarioDataDetails.mockResolvedValueOnce({
      data: {
        data: {
          preferredLanguageTypes: [{ value: 'lang-unknown', text: 'Fallback Text' }]
        }
      }
    })

    const ctx = { scenarioDetailsLookup: null }
    await useQuishingScenarioDetailsLookup.methods.callForScenarioDetails.call(ctx)

    expect(ctx.scenarioDetailsLookup.preferredLanguageTypes).toEqual([
      { value: 'lang-unknown', text: 'Fallback Text' }
    ])
  })

  it('filters out preferred languages with empty final text', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce([])
    QuishingService.getScenarioDataDetails.mockResolvedValueOnce({
      data: { data: { methodTypes: [], difficultyTypes: [] } }
    })
    getScenarioDataDetails.mockResolvedValueOnce({
      data: {
        data: {
          preferredLanguageTypes: [{ value: 'lang-1', text: '' }, { value: 'lang-2' }]
        }
      }
    })

    const ctx = { scenarioDetailsLookup: null }
    await useQuishingScenarioDetailsLookup.methods.callForScenarioDetails.call(ctx)

    expect(ctx.scenarioDetailsLookup.preferredLanguageTypes).toEqual([])
  })

  it('handles missing language options safely', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce(null)
    QuishingService.getScenarioDataDetails.mockResolvedValueOnce({
      data: { data: { methodTypes: [], difficultyTypes: [] } }
    })
    getScenarioDataDetails.mockResolvedValueOnce({
      data: {
        data: {
          preferredLanguageTypes: [{ value: 'lang-1', text: 'Direct Label' }]
        }
      }
    })

    const ctx = { scenarioDetailsLookup: null }
    await useQuishingScenarioDetailsLookup.methods.callForScenarioDetails.call(ctx)

    expect(ctx.scenarioDetailsLookup.preferredLanguageTypes).toEqual([
      { value: 'lang-1', text: 'Direct Label' }
    ])
  })

  it('uses empty preferred language list when phishing response data is missing', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce([
      { isoFriendlyName: 'English', name: 'English', resourceId: 'lang-en' }
    ])
    QuishingService.getScenarioDataDetails.mockResolvedValueOnce({
      data: { data: { methodTypes: [{ text: 'QR' }], difficultyTypes: [{ text: 'Easy' }] } }
    })
    getScenarioDataDetails.mockResolvedValueOnce({ data: {} })

    const ctx = { scenarioDetailsLookup: null }
    await useQuishingScenarioDetailsLookup.methods.callForScenarioDetails.call(ctx)

    expect(ctx.scenarioDetailsLookup.methodTypes).toEqual([{ text: 'QR' }])
    expect(ctx.scenarioDetailsLookup.difficultyTypes).toEqual([{ text: 'Easy' }])
    expect(ctx.scenarioDetailsLookup.preferredLanguageTypes).toEqual([])
  })

  it('propagates rejection when lookup request fails', async () => {
    LookupLocalStorage.getSingle.mockRejectedValueOnce(new Error('lookup-fail'))
    const ctx = { scenarioDetailsLookup: null }

    await expect(
      useQuishingScenarioDetailsLookup.methods.callForScenarioDetails.call(ctx)
    ).rejects.toThrow('lookup-fail')
    expect(ctx.scenarioDetailsLookup).toBe(null)
  })

  it('propagates rejection when quishing service fails', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce([])
    QuishingService.getScenarioDataDetails.mockRejectedValueOnce(new Error('quishing-fail'))
    getScenarioDataDetails.mockResolvedValueOnce({
      data: { data: { preferredLanguageTypes: [] } }
    })
    const ctx = { scenarioDetailsLookup: null }

    await expect(
      useQuishingScenarioDetailsLookup.methods.callForScenarioDetails.call(ctx)
    ).rejects.toThrow('quishing-fail')
    expect(ctx.scenarioDetailsLookup).toBe(null)
  })

  it('uses defaults when quishing response is undefined', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce([])
    QuishingService.getScenarioDataDetails.mockResolvedValueOnce(undefined)
    getScenarioDataDetails.mockResolvedValueOnce({
      data: { data: { preferredLanguageTypes: [] } }
    })

    const ctx = { scenarioDetailsLookup: null }
    const result = await useQuishingScenarioDetailsLookup.methods.callForScenarioDetails.call(ctx)

    expect(ctx.scenarioDetailsLookup).toEqual({
      methodTypes: [],
      difficultyTypes: [],
      preferredLanguageTypes: []
    })
    expect(result).toBeUndefined()
  })

  it('uses empty preferred language list when preferredLanguageTypes is null', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce([
      { isoFriendlyName: 'English', resourceId: 'lang-en' }
    ])
    QuishingService.getScenarioDataDetails.mockResolvedValueOnce({
      data: { data: { methodTypes: [{ text: 'QR' }], difficultyTypes: [{ text: 'Hard' }] } }
    })
    getScenarioDataDetails.mockResolvedValueOnce({
      data: { data: { preferredLanguageTypes: null } }
    })

    const ctx = { scenarioDetailsLookup: null }
    await useQuishingScenarioDetailsLookup.methods.callForScenarioDetails.call(ctx)

    expect(ctx.scenarioDetailsLookup.methodTypes).toEqual([{ text: 'QR' }])
    expect(ctx.scenarioDetailsLookup.difficultyTypes).toEqual([{ text: 'Hard' }])
    expect(ctx.scenarioDetailsLookup.preferredLanguageTypes).toEqual([])
  })

  it('keeps additional quishing payload fields while merging preferred languages', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce([
      { isoFriendlyName: 'English', resourceId: 'lang-en' }
    ])
    QuishingService.getScenarioDataDetails.mockResolvedValueOnce({
      data: {
        data: {
          methodTypes: [{ text: 'QR' }],
          difficultyTypes: [{ text: 'Hard' }],
          customField: 'preserved'
        }
      }
    })
    getScenarioDataDetails.mockResolvedValueOnce({
      data: { data: { preferredLanguageTypes: [{ value: 'lang-en', text: '' }] } }
    })

    const ctx = { scenarioDetailsLookup: null }
    await useQuishingScenarioDetailsLookup.methods.callForScenarioDetails.call(ctx)

    expect(ctx.scenarioDetailsLookup.customField).toBe('preserved')
    expect(ctx.scenarioDetailsLookup.preferredLanguageTypes).toEqual([
      { value: 'lang-en', text: 'English' }
    ])
  })

  it('prefers lookup option text over incoming preferred language text', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce([
      { isoFriendlyName: 'English (Lookup)', resourceId: 'lang-en' }
    ])
    QuishingService.getScenarioDataDetails.mockResolvedValueOnce({
      data: { data: { methodTypes: [], difficultyTypes: [] } }
    })
    getScenarioDataDetails.mockResolvedValueOnce({
      data: {
        data: {
          preferredLanguageTypes: [{ value: 'lang-en', text: 'English (Incoming)' }]
        }
      }
    })

    const ctx = { scenarioDetailsLookup: null }
    await useQuishingScenarioDetailsLookup.methods.callForScenarioDetails.call(ctx)

    expect(ctx.scenarioDetailsLookup.preferredLanguageTypes).toEqual([
      { value: 'lang-en', text: 'English (Lookup)' }
    ])
  })

  it('falls back to incoming preferred text when matched lookup option text is empty', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce([
      { resourceId: 'lang-en' }
    ])
    QuishingService.getScenarioDataDetails.mockResolvedValueOnce({
      data: { data: { methodTypes: [], difficultyTypes: [] } }
    })
    getScenarioDataDetails.mockResolvedValueOnce({
      data: {
        data: {
          preferredLanguageTypes: [{ value: 'lang-en', text: 'English (Incoming)' }]
        }
      }
    })

    const ctx = { scenarioDetailsLookup: null }
    await useQuishingScenarioDetailsLookup.methods.callForScenarioDetails.call(ctx)

    expect(ctx.scenarioDetailsLookup.preferredLanguageTypes).toEqual([
      { value: 'lang-en', text: 'English (Incoming)' }
    ])
  })

  it('propagates rejection when phishing scenario details request fails', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce([])
    QuishingService.getScenarioDataDetails.mockResolvedValueOnce({
      data: { data: { methodTypes: [], difficultyTypes: [] } }
    })
    getScenarioDataDetails.mockRejectedValueOnce(new Error('phishing-fail'))
    const ctx = { scenarioDetailsLookup: null }

    await expect(
      useQuishingScenarioDetailsLookup.methods.callForScenarioDetails.call(ctx)
    ).rejects.toThrow('phishing-fail')
    expect(ctx.scenarioDetailsLookup).toBe(null)
  })
})
