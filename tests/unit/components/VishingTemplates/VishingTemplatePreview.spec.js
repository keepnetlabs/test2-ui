jest.mock('@/api/vishing', () => ({
  getVishingTemplatePreview: jest.fn().mockResolvedValue({
    data: { data: { steps: [], name: 'Template 1' } }
  }),
  getVishingCampaignPreview: jest.fn().mockResolvedValue({
    data: { data: { steps: [], name: 'Campaign 1' } }
  })
}))

import VishingTemplatePreview from '@/components/VishingTemplates/VishingTemplatePreview.vue'
import { getVishingTemplatePreview, getVishingCampaignPreview } from '@/api/vishing'

describe('VishingTemplatePreview.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getTitle returns campaign title when isCampaign', () => {
    expect(
      VishingTemplatePreview.computed.getTitle.call({ isCampaign: true })
    ).toBe('Vishing Campaign Preview')
  })

  it('getTitle returns template title when not campaign', () => {
    expect(
      VishingTemplatePreview.computed.getTitle.call({ isCampaign: false })
    ).toBe('Vishing Template Preview')
  })

  it('getSubtitle returns selectedRow name', () => {
    expect(
      VishingTemplatePreview.computed.getSubtitle.call({
        selectedRow: { name: 'My Template' }
      })
    ).toBe('My Template')
  })

  it('isRenderSteps returns true when templateData has steps', () => {
    expect(
      VishingTemplatePreview.computed.isRenderSteps.call({
        templateData: { steps: [{ order: 1 }] }
      })
    ).toBe(true)
  })

  it('isRenderSteps returns false when no steps', () => {
    expect(
      VishingTemplatePreview.computed.isRenderSteps.call({
        templateData: { steps: [] }
      })
    ).toBe(false)
  })

  it('isRenderSteps returns false when templateData is null', () => {
    expect(VishingTemplatePreview.computed.isRenderSteps.call({ templateData: null })).toBe(false)
  })

  it('isRenderSteps returns false when steps property is missing', () => {
    expect(VishingTemplatePreview.computed.isRenderSteps.call({ templateData: {} })).toBe(false)
  })

  it('handleClose emits on-close', () => {
    const emit = jest.fn()
    VishingTemplatePreview.methods.handleClose.call({ $emit: emit })
    expect(emit).toHaveBeenCalledWith('on-close')
  })

  it('handleAudioPlay pauses other FileUpload step players but not the active index', () => {
    const pause0 = jest.fn()
    const pause1 = jest.fn()
    const ctx = {
      templateData: {
        steps: [{ inputType: 'FileUpload' }, { inputType: 'FileUpload' }]
      },
      $refs: {
        refStep0: [{ $refs: { refAudioPlayer: { onPauseAudio: pause0 } } }],
        refStep1: [{ $refs: { refAudioPlayer: { onPauseAudio: pause1 } } }]
      }
    }
    VishingTemplatePreview.methods.handleAudioPlay.call(ctx, 0)
    expect(pause0).not.toHaveBeenCalled()
    expect(pause1).toHaveBeenCalledTimes(1)
  })

  it('handleAudioPlay does not throw when step refs are missing', () => {
    const ctx = {
      templateData: {
        steps: [{ inputType: 'FileUpload' }, { inputType: 'FileUpload' }]
      },
      $refs: {}
    }
    expect(() => VishingTemplatePreview.methods.handleAudioPlay.call(ctx, 1)).not.toThrow()
  })

  it('handleClose delegates to closeDrawer from drawer mixin when present', () => {
    const emit = jest.fn()
    const closeDrawer = jest.fn()
    VishingTemplatePreview.methods.handleClose.call({ $emit: emit, closeDrawer })
    expect(closeDrawer).toHaveBeenCalledTimes(1)
    expect(emit).not.toHaveBeenCalled()
  })

  it('handleEdit emits on-edit-template when enabled', () => {
    const emit = jest.fn()
    VishingTemplatePreview.methods.handleEdit.call({ $emit: emit, editDisabled: false })
    expect(emit).toHaveBeenCalledWith('on-edit-template')
  })

  it('handleEdit returns early when disabled', () => {
    const emit = jest.fn()
    VishingTemplatePreview.methods.handleEdit.call({ $emit: emit, editDisabled: true })
    expect(emit).not.toHaveBeenCalled()
  })

  it('handleDuplicate emits on-duplicate-template when enabled', () => {
    const emit = jest.fn()
    VishingTemplatePreview.methods.handleDuplicate.call({ $emit: emit, duplicateDisabled: false })
    expect(emit).toHaveBeenCalledWith('on-duplicate-template')
  })

  it('handleDuplicate returns early when duplicateDisabled', () => {
    const emit = jest.fn()
    VishingTemplatePreview.methods.handleDuplicate.call({ $emit: emit, duplicateDisabled: true })
    expect(emit).not.toHaveBeenCalled()
  })

  it('showTemplateName is false for campaign preview', () => {
    expect(VishingTemplatePreview.computed.showTemplateName.call({ isCampaign: true })).toBe(false)
  })

  it('showTemplateName is true for template preview', () => {
    expect(VishingTemplatePreview.computed.showTemplateName.call({ isCampaign: false })).toBe(true)
  })

  it('getSubtitle returns empty string when selectedRow is missing', () => {
    expect(VishingTemplatePreview.computed.getSubtitle.call({})).toBe('')
  })

  it('callForData fetches template when not campaign', async () => {
    const ctx = {
      isLoading: false,
      selectedRow: { resourceId: 't1' },
      isCampaign: false,
      language: 'en',
      voice: 'Voice1',
      templateData: null
    }
    VishingTemplatePreview.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()
    expect(getVishingTemplatePreview).toHaveBeenCalledWith('t1')
    expect(ctx.isLoading).toBe(false)
  })

  it('callForData fetches campaign when isCampaign', async () => {
    const ctx = {
      isLoading: false,
      selectedRow: { resourceId: 'c1' },
      isCampaign: true,
      languages: [],
      templateData: null
    }
    VishingTemplatePreview.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()
    expect(getVishingCampaignPreview).toHaveBeenCalledWith('c1')
  })

  it('callForData moves order 0 step into invalidDialingNotice and removes it from steps', async () => {
    const noticeStep = { order: 0, body: 'dial notice' }
    const otherStep = { order: 1, inputType: 'Text' }
    getVishingTemplatePreview.mockResolvedValueOnce({
      data: {
        data: {
          name: 'WithNotice',
          steps: [noticeStep, otherStep]
        }
      }
    })
    const ctx = {
      isLoading: false,
      selectedRow: { resourceId: 't-notice' },
      isCampaign: false,
      language: 'en',
      voice: 'V1',
      templateData: null
    }
    VishingTemplatePreview.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.templateData.invalidDialingNotice).toEqual(noticeStep)
    expect(ctx.templateData.steps).toEqual([otherStep])
    expect(ctx.templateData.name).toBe('WithNotice')
    expect(ctx.isLoading).toBe(false)
  })

  it('callForData maps campaign language from languages when resourceId matches', async () => {
    getVishingCampaignPreview.mockResolvedValueOnce({
      data: {
        data: {
          name: 'Camp',
          steps: [],
          vishingLanguageResourceId: 'vr-99'
        }
      }
    })
    const ctx = {
      isLoading: false,
      selectedRow: { resourceId: 'camp-1' },
      isCampaign: true,
      languages: [
        {
          resourceId: 'vr-99',
          language: 'Turkish',
          name: 'Voice X',
          voiceProviderTypeId: 3
        }
      ],
      templateData: null
    }
    VishingTemplatePreview.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.templateData.language).toBe('Turkish')
    expect(ctx.templateData.voice).toBe('Voice X')
    expect(ctx.campaignVoiceResourceId).toBe('vr-99')
    expect(ctx.campaignTextToSpeechCompatible).toBe(true)
  })

  it('callForData sets campaignTextToSpeechCompatible true for voiceProviderTypeId 2 and false for type 1', async () => {
    getVishingCampaignPreview.mockResolvedValueOnce({
      data: {
        data: { name: 'Tts1', steps: [], vishingLanguageResourceId: 'lang-a' }
      }
    })
    const ctxNonTts = {
      isLoading: false,
      selectedRow: { resourceId: 'camp-tts-a' },
      isCampaign: true,
      languages: [{ resourceId: 'lang-a', language: 'en', name: 'Plain', voiceProviderTypeId: 1 }],
      campaignVoiceResourceId: '',
      campaignTextToSpeechCompatible: false,
      templateData: null
    }
    VishingTemplatePreview.methods.callForData.call(ctxNonTts)
    await Promise.resolve()
    await Promise.resolve()
    expect(ctxNonTts.campaignTextToSpeechCompatible).toBe(false)

    getVishingCampaignPreview.mockResolvedValueOnce({
      data: {
        data: { name: 'Tts2', steps: [], vishingLanguageResourceId: 'lang-b' }
      }
    })
    const ctxTts = {
      isLoading: false,
      selectedRow: { resourceId: 'camp-tts-b' },
      isCampaign: true,
      languages: [{ resourceId: 'lang-b', language: 'en', name: 'Neural', voiceProviderTypeId: 2 }],
      campaignVoiceResourceId: '',
      campaignTextToSpeechCompatible: false,
      templateData: null
    }
    VishingTemplatePreview.methods.callForData.call(ctxTts)
    await Promise.resolve()
    await Promise.resolve()
    expect(ctxTts.campaignTextToSpeechCompatible).toBe(true)
  })

  it('callForData leaves campaign templateData unchanged when language list has no match', async () => {
    getVishingCampaignPreview.mockResolvedValueOnce({
      data: {
        data: {
          name: 'Camp2',
          steps: [],
          vishingLanguageResourceId: 'missing'
        }
      }
    })
    const ctx = {
      isLoading: false,
      selectedRow: { resourceId: 'camp-2' },
      isCampaign: true,
      languages: [{ resourceId: 'other', language: 'en', name: 'n', voiceProviderTypeId: 1 }],
      campaignVoiceResourceId: '',
      campaignTextToSpeechCompatible: false,
      templateData: null
    }
    VishingTemplatePreview.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.templateData.vishingLanguageResourceId).toBe('missing')
    expect(ctx.campaignVoiceResourceId).toBe('')
    expect(ctx.campaignTextToSpeechCompatible).toBe(false)
  })

  it('callForData clears loading when template preview API rejects', async () => {
    getVishingTemplatePreview.mockRejectedValueOnce(new Error('preview failed'))
    const ctx = {
      isLoading: false,
      selectedRow: { resourceId: 't-fail' },
      isCampaign: false,
      language: 'en',
      voice: 'v',
      templateData: null
    }
    VishingTemplatePreview.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.isLoading).toBe(false)
    expect(ctx.templateData).toBeNull()
  })

  it('callForData clears loading when campaign preview API rejects', async () => {
    getVishingCampaignPreview.mockRejectedValueOnce(new Error('campaign preview failed'))
    const ctx = {
      isLoading: false,
      selectedRow: { resourceId: 'c-fail' },
      isCampaign: true,
      languages: [],
      templateData: null
    }
    VishingTemplatePreview.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.isLoading).toBe(false)
    expect(ctx.templateData).toBeNull()
  })
})
