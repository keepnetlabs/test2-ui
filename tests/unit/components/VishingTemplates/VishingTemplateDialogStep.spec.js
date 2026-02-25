import VishingTemplateDialogStep from '@/components/VishingTemplates/VishingTemplateDialogStep.vue'

describe('VishingTemplateDialogStep.vue', () => {
  it('getTitle returns step title for TextToSpeech', () => {
    expect(
      VishingTemplateDialogStep.computed.getTitle.call({
        value: { inputType: 'TextToSpeech' },
        index: 0
      })
    ).toBe('Step 1 - Text To Speech')
  })

  it('getTitle returns step title for FileUpload', () => {
    expect(
      VishingTemplateDialogStep.computed.getTitle.call({
        value: { inputType: 'FileUpload' },
        index: 1
      })
    ).toBe('Step 2 - Upload Audio')
  })

  it('getTitle returns step title for Pause', () => {
    expect(
      VishingTemplateDialogStep.computed.getTitle.call({
        value: { inputType: 'Pause' },
        index: 2
      })
    ).toBe('Step 3 - Pause')
  })

  it('isPlayAudioDisabled returns true when no url or content', () => {
    expect(
      VishingTemplateDialogStep.computed.isPlayAudioDisabled.call({
        value: {},
        isPlayAudioClicked: false
      })
    ).toBe(true)
  })

  it('getFilePreviews returns preview from inputUrl', () => {
    const result = VishingTemplateDialogStep.computed.getFilePreviews.call({
      value: { inputUrl: 'https://example.com/audio.mp3' }
    })
    expect(result[0].name).toBe('audio.mp3')
  })

  it('onRemoveStep emits removeStep', () => {
    const emit = jest.fn()
    VishingTemplateDialogStep.methods.onRemoveStep.call({ $emit: emit })
    expect(emit).toHaveBeenCalledWith('removeStep')
  })

  it('onToggleExpansion emits input with toggled isExpanded', () => {
    const emit = jest.fn()
    VishingTemplateDialogStep.methods.onToggleExpansion.call({
      $emit: emit,
      value: { isExpanded: true }
    })
    expect(emit).toHaveBeenCalledWith('input', { isExpanded: false })
  })

  it('handlePlayAudio sets isPlayAudioClicked', () => {
    const ctx = { isPlayAudioClicked: false }
    VishingTemplateDialogStep.methods.handlePlayAudio.call(ctx)
    expect(ctx.isPlayAudioClicked).toBe(true)
  })
})
