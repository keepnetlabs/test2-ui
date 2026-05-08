import VishingTemplateModal from '@/components/VishingTemplates/VishingTemplateModal.vue'

describe('VishingTemplateModal.vue', () => {
  it('getTitle returns New Vishing Template when not edit', () => {
    expect(
      VishingTemplateModal.computed.getTitle.call({ isEdit: false })
    ).toBe('New Vishing Template')
  })

  it('getTitle returns Edit Vishing Template when edit and not duplicate', () => {
    expect(
      VishingTemplateModal.computed.getTitle.call({ isEdit: true, isDuplicate: false })
    ).toBe('Edit Vishing Template')
  })

  it('getTitle returns Duplicate Vishing Template when duplicate', () => {
    expect(
      VishingTemplateModal.computed.getTitle.call({ isEdit: true, isDuplicate: true })
    ).toBe('Duplicate Vishing Template')
  })

  it('isRenderMakeAvailableFor is false when editItemsDisabled', () => {
    expect(VishingTemplateModal.computed.isRenderMakeAvailableFor.call({ editItemsDisabled: true })).toBe(
      false
    )
    expect(VishingTemplateModal.computed.isRenderMakeAvailableFor.call({ editItemsDisabled: false })).toBe(
      true
    )
  })

  it('isAddStepDisabled is true when more than four steps', () => {
    const five = [{}, {}, {}, {}, {}]
    expect(VishingTemplateModal.computed.isAddStepDisabled.call({ formValues: { steps: five } })).toBe(
      true
    )
    expect(
      VishingTemplateModal.computed.isAddStepDisabled.call({ formValues: { steps: [{}, {}, {}, {}] } })
    ).toBe(false)
  })

  it('getVoiceResourceId resolves resourceId from language and voice selection', () => {
    const ctx = {
      selectedVishingLanguage: 'English',
      selectedVishingVoice: 'Amy',
      languageItems: [
        { language: 'English', name: 'Amy', resourceId: 'rid-amy' },
        { language: 'English', name: 'Brian', resourceId: 'rid-br' }
      ]
    }
    expect(VishingTemplateModal.computed.getVoiceResourceId.call(ctx)).toBe('rid-amy')
  })

  it('getVoiceResourceId returns empty string when pair is not in languageItems', () => {
    const ctx = {
      selectedVishingLanguage: 'French',
      selectedVishingVoice: 'Amy',
      languageItems: [{ language: 'English', name: 'Amy', resourceId: 'rid-1' }]
    }
    expect(VishingTemplateModal.computed.getVoiceResourceId.call(ctx)).toBe('')
  })

  it('isVoiceTextToSpeechCompatible is true only for voiceProviderTypeId 2 or 3', () => {
    expect(
      VishingTemplateModal.computed.isVoiceTextToSpeechCompatible.call({
        selectedVishingLanguage: 'en',
        selectedVishingVoice: 'v',
        languageItems: [{ language: 'en', name: 'v', resourceId: 'x', voiceProviderTypeId: 2 }]
      })
    ).toBe(true)
    expect(
      VishingTemplateModal.computed.isVoiceTextToSpeechCompatible.call({
        selectedVishingLanguage: 'en',
        selectedVishingVoice: 'v',
        languageItems: [{ language: 'en', name: 'v', resourceId: 'x', voiceProviderTypeId: 1 }]
      })
    ).toBe(false)
  })

  it('getVoiceItems returns voice names for selected language only', () => {
    expect(
      VishingTemplateModal.computed.getVoiceItems.call({
        selectedVishingLanguage: '',
        languageItems: [{ language: 'English', name: 'Amy' }]
      })
    ).toEqual([])
    expect(
      VishingTemplateModal.computed.getVoiceItems.call({
        selectedVishingLanguage: 'English',
        languageItems: [
          { language: 'English', name: 'Amy' },
          { language: 'English', name: 'Brian' },
          { language: 'Turkish', name: 'Cem' }
        ]
      })
    ).toEqual(['Amy', 'Brian'])
  })

  it('getDialingNoticeFilePreviews derives file name from url or returns empty', () => {
    expect(
      VishingTemplateModal.computed.getDialingNoticeFilePreviews.call({
        formValues: { dialingNoticeStepInputUrl: 'https://cdn.example.com/path/notice.mp3' }
      })
    ).toEqual([{ name: 'notice.mp3' }])
    expect(
      VishingTemplateModal.computed.getDialingNoticeFilePreviews.call({ formValues: {} })
    ).toEqual([])
  })

  it('isPlayAudioDisabled for dialing notice matches url content and click state', () => {
    expect(
      VishingTemplateModal.computed.isPlayAudioDisabled.call({
        formValues: {},
        isPlayAudioClicked: false
      })
    ).toBe(true)
    expect(
      VishingTemplateModal.computed.isPlayAudioDisabled.call({
        formValues: { dialingNoticeStepInputUrl: 'https://x.com/a.mp3' },
        isPlayAudioClicked: false
      })
    ).toBe(false)
    expect(
      VishingTemplateModal.computed.isPlayAudioDisabled.call({
        formValues: { dialingNoticeStepInputUrl: 'https://x.com/a.mp3' },
        isPlayAudioClicked: true
      })
    ).toBe(true)
  })

  it('onVishingLanguageChange clears selected voice', () => {
    const ctx = { selectedVishingVoice: 'Amy' }
    VishingTemplateModal.methods.onVishingLanguageChange.call(ctx)
    expect(ctx.selectedVishingVoice).toBe('')
  })

  it('onRemoveStep removes index and reassigns step order', () => {
    const ctx = {
      formValues: {
        steps: [
          { order: 1, id: 'a' },
          { order: 2, id: 'b' },
          { order: 3, id: 'c' }
        ]
      }
    }
    VishingTemplateModal.methods.onRemoveStep.call(ctx, 1)
    expect(ctx.formValues.steps.map((s) => s.id)).toEqual(['a', 'c'])
    expect(ctx.formValues.steps[0].order).toBe(1)
    expect(ctx.formValues.steps[1].order).toBe(2)
  })

  it('handlePlayAudio sets isPlayAudioClicked', () => {
    const ctx = { isPlayAudioClicked: false }
    VishingTemplateModal.methods.handlePlayAudio.call(ctx)
    expect(ctx.isPlayAudioClicked).toBe(true)
  })
})
