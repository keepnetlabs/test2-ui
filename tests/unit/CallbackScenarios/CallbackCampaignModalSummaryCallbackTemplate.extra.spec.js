import CallbackCampaignModalSummaryCallbackTemplate from '@/components/CallbackScenarios/CallbackCampaignModalSummaryCallbackTemplate.vue'

describe('CallbackCampaignModalSummaryCallbackTemplate.vue (extra branch coverage)', () => {
  describe('computed', () => {
    it('hasAudioFile returns true when steps have FileUpload', () => {
      const ctx = {
        formValues: {
          template: {
            steps: [{ inputType: 'TextToSpeech' }, { inputType: 'FileUpload' }]
          }
        }
      }
      expect(
        CallbackCampaignModalSummaryCallbackTemplate.computed.hasAudioFile.call(ctx)
      ).toBe(true)
    })

    it('hasAudioFile returns true when invalidDialingNotice has FileUpload', () => {
      const ctx = {
        formValues: {
          template: {
            steps: [],
            invalidDialingNotice: { inputType: 'FileUpload' }
          }
        }
      }
      expect(
        CallbackCampaignModalSummaryCallbackTemplate.computed.hasAudioFile.call(ctx)
      ).toBe(true)
    })

    it('hasAudioFile returns true when callGreeting has FileUpload', () => {
      const ctx = {
        formValues: {
          template: {
            steps: [],
            callGreeting: { inputType: 'FileUpload' }
          }
        }
      }
      expect(
        CallbackCampaignModalSummaryCallbackTemplate.computed.hasAudioFile.call(ctx)
      ).toBe(true)
    })

    it('hasAudioFile returns false when no FileUpload', () => {
      const ctx = {
        formValues: {
          template: {
            steps: [{ inputType: 'TextToSpeech' }],
            invalidDialingNotice: { inputType: 'TextToSpeech' },
            callGreeting: { inputType: 'TextToSpeech' }
          }
        }
      }
      expect(
        CallbackCampaignModalSummaryCallbackTemplate.computed.hasAudioFile.call(ctx)
      ).toBe(false)
    })

    it('isTextToSpeechCompatible returns true for voiceProviderTypeId 2 or 3', () => {
      expect(
        CallbackCampaignModalSummaryCallbackTemplate.computed.isTextToSpeechCompatible.call({
          formValues: { template: { voiceProviderTypeId: 2 } }
        })
      ).toBe(true)
      expect(
        CallbackCampaignModalSummaryCallbackTemplate.computed.isTextToSpeechCompatible.call({
          formValues: { template: { voiceProviderTypeId: 3 } }
        })
      ).toBe(true)
    })

    it('isTextToSpeechCompatible returns false for other voiceProviderTypeId', () => {
      expect(
        CallbackCampaignModalSummaryCallbackTemplate.computed.isTextToSpeechCompatible.call({
          formValues: { template: { voiceProviderTypeId: 1 } }
        })
      ).toBe(false)
    })
  })

  describe('getBadgeColor', () => {
    it('returns colors for each difficulty', () => {
      const method = CallbackCampaignModalSummaryCallbackTemplate.methods.getBadgeColor
      expect(method.call({}, 'easy')).toBe('#217124')
      expect(method.call({}, 'medium')).toBe('#2196f3')
      expect(method.call({}, 'hard')).toBe('#f56c6c')
      expect(method.call({}, 'unknown')).toBe('#2196f3')
      expect(method.call({})).toBe('#2196f3')
    })
  })
})
