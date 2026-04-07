jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    getLanguages: jest.fn(),
    getTraining: jest.fn()
  }
}))

jest.mock('@/api/phishingsimulator', () => ({
  getPhishingScenarioLandingPageAndEmailTemplate: jest.fn()
}))

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    getQuishingScenarioLandingPageAndEmailTemplate: jest.fn()
  }
}))

jest.mock('@/api/smishing', () => ({
  __esModule: true,
  default: {
    previewSmishingScenario: jest.fn()
  }
}))

const loadService = () => {
  jest.resetModules()

  const AwarenessEducatorService = require('@/api/awarenessEducator').default
  const { getPhishingScenarioLandingPageAndEmailTemplate } = require('@/api/phishingsimulator')
  const QuishingService = require('@/api/quishing').default
  const SmishingService = require('@/api/smishing').default
  const { resolveAgenticRetryLanguage } = require('@/services/agenticAIRetryLanguage')

  return {
    AwarenessEducatorService,
    getPhishingScenarioLandingPageAndEmailTemplate,
    QuishingService,
    SmishingService,
    resolveAgenticRetryLanguage
  }
}

describe('agenticAIRetryLanguage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns phishing preview language name directly when available', async () => {
    const {
      getPhishingScenarioLandingPageAndEmailTemplate,
      AwarenessEducatorService,
      resolveAgenticRetryLanguage
    } = loadService()

    getPhishingScenarioLandingPageAndEmailTemplate.mockResolvedValue({
      data: {
        data: {
          emailTemplate: {
            languageTypeName: 'German'
          }
        }
      }
    })

    const language = await resolveAgenticRetryLanguage({
      activityType: 1,
      scenarioResourceId: 'scenario-1',
      preferredLanguage: 'English'
    })

    expect(language).toBe('German')
    expect(getPhishingScenarioLandingPageAndEmailTemplate).toHaveBeenCalledWith('scenario-1')
    expect(AwarenessEducatorService.getLanguages).not.toHaveBeenCalled()
  })

  it('resolves training language name from language id lookup', async () => {
    const { AwarenessEducatorService, resolveAgenticRetryLanguage } = loadService()

    AwarenessEducatorService.getTraining.mockResolvedValue({
      data: {
        data: {
          languageId: 'lang-2'
        }
      }
    })
    AwarenessEducatorService.getLanguages.mockResolvedValue({
      data: {
        data: [
          { id: 'lang-1', isoFriendlyName: 'English' },
          { id: 'lang-2', isoFriendlyName: 'Turkish' }
        ]
      }
    })

    const language = await resolveAgenticRetryLanguage({
      activityType: 4,
      trainingResourceId: 'training-1',
      preferredLanguage: 'English'
    })

    expect(language).toBe('Turkish')
    expect(AwarenessEducatorService.getTraining).toHaveBeenCalledWith('training-1')
    expect(AwarenessEducatorService.getLanguages).toHaveBeenCalledTimes(1)
  })

  it('uses quishing template fallback when emailTemplate is missing', async () => {
    const { QuishingService, resolveAgenticRetryLanguage } = loadService()

    QuishingService.getQuishingScenarioLandingPageAndEmailTemplate.mockResolvedValue({
      data: {
        data: {
          quishingTemplate: {
            languageTypeName: 'French'
          }
        }
      }
    })

    const language = await resolveAgenticRetryLanguage({
      activityType: 2,
      scenarioResourceId: 'scenario-2',
      preferredLanguage: 'English'
    })

    expect(language).toBe('French')
  })

  it('falls back to row preferredLanguage when content lookup fails', async () => {
    const { SmishingService, resolveAgenticRetryLanguage } = loadService()

    SmishingService.previewSmishingScenario.mockRejectedValue(new Error('preview failed'))

    const language = await resolveAgenticRetryLanguage({
      activityType: 3,
      scenarioResourceId: 'scenario-3',
      preferredLanguage: 'Spanish'
    })

    expect(language).toBe('Spanish')
  })
})
