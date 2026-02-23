jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    getCallbackCampaign: jest.fn(),
    getCallbackScenarioPreview: jest.fn()
  }
}))

jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    getLanguages: jest.fn(),
    getTraining: jest.fn()
  }
}))

jest.mock('@/utils/functions', () => ({
  createRandomCryptStringNumber: jest.fn(() => 'rnd-1')
}))

import CampaignPreviewModal from '@/components/CallbackCampaignManager/CampaignPreviewModal.vue'
import CallbackService from '@/api/callback'
import AwarenessEducatorService from '@/api/awarenessEducator'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CallbackCampaignManager/CampaignPreviewModal.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed subtitle and simple methods work', () => {
    expect(
      CampaignPreviewModal.computed.getSubtitle.call({ selectedRow: { name: 'Campaign A' } })
    ).toBe('Campaign A')
    expect(CampaignPreviewModal.computed.getSubtitle.call({ selectedRow: null })).toBe('')

    const emit = jest.fn()
    const ctx = { isLoading: true, $emit: emit }
    CampaignPreviewModal.methods.setLoading.call(ctx)
    expect(ctx.isLoading).toBe(false)
    CampaignPreviewModal.methods.handleClose.call(ctx)
    expect(emit).toHaveBeenCalledWith('on-close')
  })

  it('callForLanguages fills trainingLanguages from api', async () => {
    AwarenessEducatorService.getLanguages.mockResolvedValueOnce({
      data: { data: [{ id: 1, name: 'English' }] }
    })
    const ctx = { isPreviewLoading: false, trainingLanguages: [] }

    CampaignPreviewModal.methods.callForLanguages.call(ctx)
    await flushPromises()

    expect(ctx.isPreviewLoading).toBe(true)
    expect(ctx.trainingLanguages).toEqual([{ id: 1, name: 'English' }])
  })

  it('callForTrainingDetail maps selected languages and merges training details', async () => {
    AwarenessEducatorService.getTraining.mockResolvedValueOnce({
      data: { data: { name: 'Training 1', category: 'Phishing' } }
    })
    const ctx = {
      trainingParams: { trainingId: 't-1', trainingLanguageIds: [1] },
      trainingLanguages: [{ id: 1, name: 'English' }],
      selectedLanguages: []
    }

    CampaignPreviewModal.methods.callForTrainingDetail.call(ctx)
    await flushPromises()

    expect(ctx.selectedLanguages).toEqual([{ text: 'English', value: 1 }])
    expect(ctx.trainingParams.name).toBe('Training 1')
    expect(ctx.trainingParams.languages).toBe('English')
  })

  it('setActiveScenario maps preview data and resets training params when no training is linked', async () => {
    CallbackService.getCallbackScenarioPreview.mockResolvedValueOnce({
      data: {
        data: {
          emailTemplate: {
            template: '<html />',
            name: 'Mail Name',
            fromName: 'Sender',
            fromAddress: 'sender@test.com',
            subject: 'Subj',
            phishingFileName: 'att.pdf'
          },
          callbackTemplate: {
            vishingLanguageResourceId: 'lang-1',
            steps: [{ id: 's1' }, { id: 's2' }]
          }
        }
      }
    })
    const ctx = {
      languages: [{ resourceId: 'lang-1', language: 'English', name: 'Alice', voiceProviderTypeId: 2 }],
      isLoadingScenario: false,
      emailTemplate: null,
      emailTemplateParams: {},
      callbackTemplateParams: {},
      isTextToSpeechCompatible: false,
      trainingParams: { trainingId: 'old' },
      callForTrainingDetail: jest.fn(),
      tab: 'callback'
    }

    CampaignPreviewModal.methods.setActiveScenario.call(ctx, { value: 'sc-1' })
    await flushPromises()

    expect(CallbackService.getCallbackScenarioPreview).toHaveBeenCalledWith('sc-1')
    expect(ctx.emailTemplate).toBe('<html />')
    expect(ctx.emailTemplateParams.attachment).toEqual({ name: 'att.pdf' })
    expect(ctx.callbackTemplateParams.language).toBe('English')
    expect(ctx.callbackTemplateParams.voice).toBe('Alice')
    expect(ctx.callbackTemplateParams.steps).toHaveLength(0)
    expect(ctx.isTextToSpeechCompatible).toBe(true)
    expect(ctx.trainingParams).toBe(null)
    expect(ctx.tab).toBe('email')
    expect(ctx.isLoadingScenario).toBe(false)
  })

  it('setActiveScenario calls training detail when scenario has training id', async () => {
    CallbackService.getCallbackScenarioPreview.mockResolvedValueOnce({
      data: {
        data: {
          emailTemplate: {},
          callbackTemplate: { vishingLanguageResourceId: 'lang-1', steps: [{}, {}] }
        }
      }
    })
    const callForTrainingDetail = jest.fn()
    const ctx = {
      languages: [{ resourceId: 'lang-1', language: 'English', name: 'Alice', voiceProviderTypeId: 1 }],
      isLoadingScenario: false,
      emailTemplate: null,
      emailTemplateParams: {},
      callbackTemplateParams: {},
      isTextToSpeechCompatible: true,
      trainingParams: null,
      callForTrainingDetail,
      tab: 'callback'
    }

    CampaignPreviewModal.methods.setActiveScenario.call(ctx, {
      value: 'sc-2',
      trainingId: 't-2',
      trainingLanguageIds: [2]
    })
    await flushPromises()

    expect(ctx.trainingParams).toEqual({ trainingId: 't-2', trainingLanguageIds: [2] })
    expect(callForTrainingDetail).toHaveBeenCalled()
    expect(ctx.isTextToSpeechCompatible).toBe(false)
  })

  it('callForScenarioDetail picks scenario by tab index', () => {
    const setActiveScenario = jest.fn()
    const ctx = {
      phishingScenarios: [{ value: 'a' }, { value: 'b' }],
      setActiveScenario
    }

    CampaignPreviewModal.methods.callForScenarioDetail.call(ctx, { index: '1' })
    expect(setActiveScenario).toHaveBeenCalledWith({ value: 'b' })
  })

  it('callForData maps scenarios, selects first and toggles loading with timeout', async () => {
    jest.useFakeTimers()
    CallbackService.getCallbackCampaign.mockResolvedValueOnce({
      data: {
        data: {
          phishingScenarios: [{ value: 's1', text: 'Scenario 1' }, { value: 's2', text: 'Scenario 2' }]
        }
      }
    })
    const setLoading = jest.fn()
    const setActiveScenario = jest.fn()
    const ctx = {
      selectedRow: { resourceId: 'cmp-1' },
      phishingScenarios: [],
      selectedScenario: null,
      timeoutId: '',
      setLoading,
      setActiveScenario
    }

    CampaignPreviewModal.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()
    expect(setLoading).toHaveBeenCalledWith(true)
    expect(ctx.phishingScenarios).toHaveLength(2)
    expect(ctx.selectedScenario.value).toBe('s1')
    expect(setActiveScenario).toHaveBeenCalledWith(expect.objectContaining({ value: 's1' }))

    jest.advanceTimersByTime(500)
    expect(setLoading).toHaveBeenLastCalledWith()
    jest.useRealTimers()
  })
})
