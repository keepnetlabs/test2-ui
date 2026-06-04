jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    getCallbackTemplatePreview: jest.fn()
  }
}))

jest.mock('@/api/vishing', () => ({
  getVishingCampaignPreview: jest.fn()
}))

import CallbackTemplatePreview from '@/components/CallbackScenarios/CallbackTemplatePreview.vue'
import CallbackService from '@/api/callback'
import { getVishingCampaignPreview } from '@/api/vishing'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

const buildPreviewResponse = (overrides = {}) => ({
  data: {
    data: {
      steps: [{ id: 's0' }, { id: 's1' }, { id: 's2' }],
      vishingLanguageResourceId: 'lang-1',
      ...overrides
    }
  }
})

beforeEach(() => {
  jest.clearAllMocks()
  CallbackService.getCallbackTemplatePreview.mockResolvedValue(buildPreviewResponse())
  getVishingCampaignPreview.mockResolvedValue(buildPreviewResponse())
})

describe('CallbackTemplatePreview.vue (extra branch coverage)', () => {
  describe('computed', () => {
    it('getTitle returns campaign title when isCampaign', () => {
      expect(
        CallbackTemplatePreview.computed.getTitle.call({ isCampaign: true })
      ).toBe('Callback Campaign Preview')
    })

    it('getTitle returns template title when not isCampaign', () => {
      expect(
        CallbackTemplatePreview.computed.getTitle.call({ isCampaign: false })
      ).toBe('Callback Template Preview')
    })

    it('getSubtitle returns selectedRow name', () => {
      expect(
        CallbackTemplatePreview.computed.getSubtitle.call({
          selectedRow: { name: 'Template A' }
        })
      ).toBe('Template A')
    })

    it('isRenderSteps returns true when templateData has steps', () => {
      expect(
        CallbackTemplatePreview.computed.isRenderSteps.call({
          templateData: { steps: [1, 2, 3] }
        })
      ).toBe(true)
    })

    it('isRenderSteps returns false when templateData has no steps', () => {
      expect(
        CallbackTemplatePreview.computed.isRenderSteps.call({
          templateData: { steps: [] }
        })
      ).toBe(false)
    })

    it('showEditButton hides edit when selected row is not owner', () => {
      expect(
        CallbackTemplatePreview.computed.showEditButton.call({
          selectedRow: { isOwner: false }
        })
      ).toBe(false)
      expect(
        CallbackTemplatePreview.computed.showEditButton.call({
          selectedRow: { isOwner: true }
        })
      ).toBe(true)
      expect(
        CallbackTemplatePreview.computed.showEditButton.call({
          selectedRow: null
        })
      ).toBe(true)
    })
  })

  describe('handleClose', () => {
    it('delegates to closeDrawer', () => {
      const closeDrawer = jest.fn()
      CallbackTemplatePreview.methods.handleClose.call({ closeDrawer })
      expect(closeDrawer).toHaveBeenCalled()
    })
  })

  describe('handleEdit and handleDuplicate', () => {
    it('emit events with selectedRow payload', () => {
      const emit = jest.fn()
      const selectedRow = { resourceId: 't1', name: 'Template A' }
      CallbackTemplatePreview.methods.handleEdit.call({ $emit: emit, selectedRow, showEditButton: true })
      expect(emit).toHaveBeenCalledWith('on-edit', selectedRow)
      CallbackTemplatePreview.methods.handleDuplicate.call({ $emit: emit, selectedRow })
      expect(emit).toHaveBeenCalledWith('on-duplicate', selectedRow)
    })

    it('does not emit edit when selected row is not owner', () => {
      const emit = jest.fn()
      CallbackTemplatePreview.methods.handleEdit.call({
        $emit: emit,
        selectedRow: { resourceId: 't1', isOwner: false },
        showEditButton: false
      })
      expect(emit).not.toHaveBeenCalled()
    })
  })

  describe('getNavigationDrawerClass', () => {
    it('toggles nested-drawer class via isNested', () => {
      expect(
        CallbackTemplatePreview.computed.getNavigationDrawerClass.call({ isNested: false })
      ).toEqual({
        'k-navigation-drawer k-navigation-drawer--preview-dialog': true,
        'nested-drawer': false
      })
      expect(
        CallbackTemplatePreview.computed.getNavigationDrawerClass.call({ isNested: true })
      ).toEqual({
        'k-navigation-drawer k-navigation-drawer--preview-dialog': true,
        'nested-drawer': true
      })
    })
  })

  describe('callForData', () => {
    const baseLanguages = [
      { resourceId: 'lang-1', language: 'English', name: 'Alice', voiceProviderTypeId: 2 }
    ]

    it('calls vishing campaign endpoint when isCampaign is true', async () => {
      const ctx = {
        isCampaign: true,
        selectedRow: { resourceId: 'cmp-1' },
        languageItems: baseLanguages,
        templateData: null,
        isLoading: false,
        isTextToSpeechCompatible: false
      }
      CallbackTemplatePreview.methods.callForData.call(ctx)
      await flushPromises()

      expect(getVishingCampaignPreview).toHaveBeenCalledWith('cmp-1')
      expect(CallbackService.getCallbackTemplatePreview).not.toHaveBeenCalled()
      expect(ctx.templateData.language).toBe('English')
      expect(ctx.templateData.voice).toBe('Alice')
      expect(ctx.templateData.invalidDialingNotice).toEqual({ id: 's0' })
      expect(ctx.templateData.callGreeting).toEqual({ id: 's1' })
      expect(ctx.templateData.steps).toHaveLength(1)
      expect(ctx.isTextToSpeechCompatible).toBe(true)
      expect(ctx.isLoading).toBe(false)
    })

    it('calls callback template endpoint when isCampaign is false', async () => {
      const ctx = {
        isCampaign: false,
        selectedRow: { resourceId: 't-1' },
        languageItems: baseLanguages,
        templateData: null,
        isLoading: false,
        isTextToSpeechCompatible: true
      }
      CallbackTemplatePreview.methods.callForData.call(ctx)
      await flushPromises()

      expect(CallbackService.getCallbackTemplatePreview).toHaveBeenCalledWith('t-1')
      expect(getVishingCampaignPreview).not.toHaveBeenCalled()
    })

    it('isTextToSpeechCompatible is false when voiceProviderTypeId is not in [2,3]', async () => {
      const ctx = {
        isCampaign: false,
        selectedRow: { resourceId: 't-1' },
        languageItems: [
          { resourceId: 'lang-1', language: 'English', name: 'Alice', voiceProviderTypeId: 1 }
        ],
        templateData: null,
        isLoading: false,
        isTextToSpeechCompatible: true
      }
      CallbackTemplatePreview.methods.callForData.call(ctx)
      await flushPromises()

      expect(ctx.isTextToSpeechCompatible).toBe(false)
    })

    it('isTextToSpeechCompatible is true when voiceProviderTypeId is 3', async () => {
      CallbackService.getCallbackTemplatePreview.mockResolvedValueOnce(
        buildPreviewResponse({ vishingLanguageResourceId: 'lang-3' })
      )
      const ctx = {
        isCampaign: false,
        selectedRow: { resourceId: 't-1' },
        languageItems: [
          { resourceId: 'lang-3', language: 'German', name: 'Bob', voiceProviderTypeId: 3 }
        ],
        templateData: null,
        isLoading: false,
        isTextToSpeechCompatible: false
      }
      CallbackTemplatePreview.methods.callForData.call(ctx)
      await flushPromises()

      expect(ctx.isTextToSpeechCompatible).toBe(true)
    })
  })

  describe('handleAudioPlay', () => {
    it('pauses audio on every other FileUpload step but skips matching index and non-FileUpload', () => {
      const pauseAtIndex0 = jest.fn()
      const pauseAtIndex2 = jest.fn()
      const ctx = {
        templateData: {
          steps: [
            { inputType: 'FileUpload' },
            { inputType: 'TextToSpeech' },
            { inputType: 'FileUpload' },
            { inputType: 'FileUpload' }
          ]
        },
        $refs: {
          refStep0: [{ $refs: { refAudioPlayer: { onPauseAudio: pauseAtIndex0 } } }],
          refStep2: [{ $refs: { refAudioPlayer: { onPauseAudio: pauseAtIndex2 } } }],
          refStep3: undefined
        }
      }

      CallbackTemplatePreview.methods.handleAudioPlay.call(ctx, 3)

      expect(pauseAtIndex0).toHaveBeenCalledTimes(1)
      expect(pauseAtIndex2).toHaveBeenCalledTimes(1)
    })

    it('does nothing when refs are missing thanks to optional chaining', () => {
      const ctx = {
        templateData: {
          steps: [{ inputType: 'FileUpload' }]
        },
        $refs: {}
      }
      expect(() =>
        CallbackTemplatePreview.methods.handleAudioPlay.call(ctx, 5)
      ).not.toThrow()
    })
  })
})
