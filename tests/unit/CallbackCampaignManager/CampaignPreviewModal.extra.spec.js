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

import CampaignPreviewModal from '@/components/CallbackCampaignManager/CampaignPreviewModal.vue'
import CallbackService from '@/api/callback'
import AwarenessEducatorService from '@/api/awarenessEducator'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignPreviewModal.vue (extra branch coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('setActiveScenario branches', () => {
    it('sets attachment to null when emailTemplate has no phishingFileName', async () => {
      CallbackService.getCallbackScenarioPreview.mockResolvedValueOnce({
        data: {
          data: {
            emailTemplate: {
              template: '<p>x</p>',
              name: 'Mail',
              fromName: 'S',
              fromAddress: 's@t.com',
              subject: 'Sub'
            },
            callbackTemplate: {
              vishingLanguageResourceId: 'lang-1',
              steps: [{ id: 's1' }, { id: 's2' }]
            }
          }
        }
      })
      const ctx = {
        languages: [
          { resourceId: 'lang-1', language: 'English', name: 'Alice', voiceProviderTypeId: 2 }
        ],
        isLoadingScenario: false,
        emailTemplateParams: {},
        callbackTemplateParams: {},
        callForTrainingDetail: jest.fn(),
        tab: 'callback'
      }

      CampaignPreviewModal.methods.setActiveScenario.call(ctx, { value: 'sc-1' })
      await flushPromises()

      expect(ctx.emailTemplateParams.attachment).toBeNull()
    })

    it('handles empty steps array', async () => {
      CallbackService.getCallbackScenarioPreview.mockResolvedValueOnce({
        data: {
          data: {
            emailTemplate: {},
            callbackTemplate: {
              vishingLanguageResourceId: 'lang-1',
              steps: []
            }
          }
        }
      })
      const ctx = {
        languages: [
          { resourceId: 'lang-1', language: 'EN', name: 'Amy', voiceProviderTypeId: 3 }
        ],
        isLoadingScenario: false,
        emailTemplateParams: {},
        callbackTemplateParams: {},
        callForTrainingDetail: jest.fn(),
        tab: 'callback'
      }

      CampaignPreviewModal.methods.setActiveScenario.call(ctx, { value: 'sc-1' })
      await flushPromises()

      expect(ctx.callbackTemplateParams.voice).toBe('Amy')
      expect(ctx.isTextToSpeechCompatible).toBe(true)
    })


    it('isTextToSpeechCompatible false when voiceProviderTypeId is 1', async () => {
      CallbackService.getCallbackScenarioPreview.mockResolvedValueOnce({
        data: {
          data: {
            emailTemplate: {},
            callbackTemplate: {
              vishingLanguageResourceId: 'lang-1',
              steps: [{}, {}]
            }
          }
        }
      })
      const ctx = {
        languages: [
          { resourceId: 'lang-1', language: 'EN', name: 'Bob', voiceProviderTypeId: 1 }
        ],
        isLoadingScenario: false,
        emailTemplateParams: {},
        callbackTemplateParams: {},
        callForTrainingDetail: jest.fn(),
        tab: 'callback'
      }

      CampaignPreviewModal.methods.setActiveScenario.call(ctx, { value: 'sc-1' })
      await flushPromises()

      expect(ctx.isTextToSpeechCompatible).toBe(false)
    })
  })

  describe('callForScenarioDetail', () => {
    it('handles event with index 0', () => {
      const setActiveScenario = jest.fn()
      const ctx = {
        phishingScenarios: [{ value: 'a' }, { value: 'b' }],
        setActiveScenario
      }

      CampaignPreviewModal.methods.callForScenarioDetail.call(ctx, { index: '0' })
      expect(setActiveScenario).toHaveBeenCalledWith({ value: 'a' })
    })
  })

  describe('fallback branches', () => {
    it('callForData handles empty phishingScenarios list', async () => {
      CallbackService.getCallbackCampaign.mockResolvedValueOnce({
        data: { data: { phishingScenarios: [] } }
      })
      jest.useFakeTimers()
      const setLoading = jest.fn()
      const setActiveScenario = jest.fn()
      const ctx = {
        selectedRow: { resourceId: 'cmp-empty' },
        phishingScenarios: [],
        selectedScenario: null,
        timeoutId: '',
        setLoading,
        setActiveScenario
      }

      CampaignPreviewModal.methods.callForData.call(ctx)
      await Promise.resolve()
      await Promise.resolve()
      expect(ctx.phishingScenarios).toEqual([])
      expect(ctx.selectedScenario).toEqual({})
      expect(setActiveScenario).toHaveBeenCalledWith({})

      jest.advanceTimersByTime(500)
      jest.useRealTimers()
    })

    it('callForLanguages falls back to empty array on missing payload', async () => {
      AwarenessEducatorService.getLanguages.mockResolvedValueOnce({ data: {} })
      const ctx = { isPreviewLoading: false, trainingLanguages: [{ id: 1 }] }

      CampaignPreviewModal.methods.callForLanguages.call(ctx)
      await flushPromises()

      expect(ctx.trainingLanguages).toEqual([])
      expect(ctx.isPreviewLoading).toBe(true)
    })

    it('callForTrainingDetail ignores non-existing language ids', async () => {
      AwarenessEducatorService.getTraining.mockResolvedValueOnce({
        data: { data: { name: 'Any' } }
      })
      const ctx = {
        trainingParams: { trainingId: 't1', trainingLanguageIds: [99] },
        trainingLanguages: [{ id: 1, name: 'English' }],
        selectedLanguages: []
      }

      CampaignPreviewModal.methods.callForTrainingDetail.call(ctx)
      await flushPromises()

      expect(ctx.selectedLanguages).toEqual([])
      expect(ctx.trainingParams.languages).toBe('')
    })
  })

  describe('beforeDestroy', () => {
    it('clears timeoutId', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')
      const ctx = { timeoutId: 12345 }
      CampaignPreviewModal.beforeDestroy.call(ctx)
      expect(clearTimeoutSpy).toHaveBeenCalledWith(12345)
      clearTimeoutSpy.mockRestore()
    })
  })
})
