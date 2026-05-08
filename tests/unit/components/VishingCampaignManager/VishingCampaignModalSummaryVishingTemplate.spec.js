import VishingCampaignModalSummaryVishingTemplate from '@/components/VishingCampaignManager/VishingCampaignModalSummaryVishingTemplate.vue'

describe('VishingCampaignModalSummaryVishingTemplate.vue', () => {
  it('has correct component name', () => {
    expect(VishingCampaignModalSummaryVishingTemplate.name).toBe(
      'VishingCampaignModalSummaryVishingTemplate'
    )
  })

  it('hasAudioFile returns true when step has FileUpload', () => {
    const ctx = {
      formValues: {
        template: {
          steps: [{ inputType: 'FileUpload' }],
          invalidDialingNotice: {}
        }
      }
    }
    expect(
      VishingCampaignModalSummaryVishingTemplate.computed.hasAudioFile.call(ctx)
    ).toBe(true)
  })

  it('hasAudioFile is true when invalidDialingNotice uses FileUpload', () => {
    const ctx = {
      formValues: {
        template: {
          steps: [{ inputType: 'TextToSpeech' }],
          invalidDialingNotice: { inputType: 'FileUpload' }
        }
      }
    }
    expect(VishingCampaignModalSummaryVishingTemplate.computed.hasAudioFile.call(ctx)).toBe(true)
  })

  it('hasAudioFile is false when no FileUpload in steps or notice', () => {
    const ctx = {
      formValues: {
        template: {
          steps: [{ inputType: 'Pause' }],
          invalidDialingNotice: { inputType: 'Pause' }
        }
      }
    }
    expect(VishingCampaignModalSummaryVishingTemplate.computed.hasAudioFile.call(ctx)).toBe(false)
  })

  it('isTextToSpeechCompatible returns true for voiceProviderTypeId 2 or 3', () => {
    expect(
      VishingCampaignModalSummaryVishingTemplate.computed.isTextToSpeechCompatible.call({
        formValues: { template: { voiceProviderTypeId: 2 } }
      })
    ).toBe(true)
    expect(
      VishingCampaignModalSummaryVishingTemplate.computed.isTextToSpeechCompatible.call({
        formValues: { template: { voiceProviderTypeId: 3 } }
      })
    ).toBe(true)
  })

  it('isTextToSpeechCompatible is false for voiceProviderTypeId outside 2 and 3', () => {
    expect(
      VishingCampaignModalSummaryVishingTemplate.computed.isTextToSpeechCompatible.call({
        formValues: { template: { voiceProviderTypeId: 1 } }
      })
    ).toBe(false)
  })

  it('getBadgeColor returns correct colors for difficulty levels', () => {
    const { getBadgeColor } = VishingCampaignModalSummaryVishingTemplate.methods
    expect(getBadgeColor('easy')).toBe('#217124')
    expect(getBadgeColor('medium')).toBe('#2196f3')
    expect(getBadgeColor('hard')).toBe('#f56c6c')
    expect(getBadgeColor('unknown')).toBe('#2196f3')
  })

  it('getStepText returns text for input types', () => {
    const { getStepText } = VishingCampaignModalSummaryVishingTemplate.methods
    expect(getStepText('TextToSpeech')).toBe('Text to Speech')
    expect(getStepText('FileUpload')).toBe('Upload Audio')
    expect(getStepText('Pause')).toBe('Pause')
    expect(getStepText('Unknown')).toBe('')
  })

  it('getBadgeText returns difficulty string unchanged', () => {
    expect(VishingCampaignModalSummaryVishingTemplate.methods.getBadgeText('Medium')).toBe('Medium')
  })

  it('getStepName uses inputType when step has no type field', () => {
    const ctx = {
      getStepText: VishingCampaignModalSummaryVishingTemplate.methods.getStepText
    }
    expect(
      VishingCampaignModalSummaryVishingTemplate.methods.getStepName.call(
        ctx,
        { inputType: 'FileUpload' },
        2
      )
    ).toBe('Step 3 - Upload Audio')
  })

  it('handleSelectedTemplateStepChange updates selectedTemplateStepIndex', () => {
    const ctx = { selectedTemplateStepIndex: 0 }
    VishingCampaignModalSummaryVishingTemplate.methods.handleSelectedTemplateStepChange.call(
      ctx,
      2
    )
    expect(ctx.selectedTemplateStepIndex).toBe(2)
  })
})
