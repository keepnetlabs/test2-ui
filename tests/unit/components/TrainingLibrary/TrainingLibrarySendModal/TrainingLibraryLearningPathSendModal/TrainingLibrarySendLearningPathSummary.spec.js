import TrainingLibrarySendLearningPathSummary from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibraryLearningPathSendModal/TrainingLibrarySendLearningPathSummary.vue'

describe('TrainingLibrarySendLearningPathSummary.vue', () => {
  it('getSettingItems returns settings object', () => {
    const settings = { Schedule: 'Now' }
    const result = TrainingLibrarySendLearningPathSummary.computed.getSettingItems.call({
      formData: { settings }
    })
    expect(result).toEqual(settings)
  })

  it('handleCertificateLanguageChange updates selected certificate template', () => {
    const ctx = {
      formData: {
        certificateData: {
          selectedLanguageResourceId: '',
          selectedLanguageName: '',
          template: '',
          languages: [
            { languageTypeResourceId: 'en', languageTypeName: 'English', template: '<p>x</p>' }
          ]
        }
      }
    }
    TrainingLibrarySendLearningPathSummary.methods.handleCertificateLanguageChange.call(ctx, 'en')
    expect(ctx.formData.certificateData.selectedLanguageName).toBe('English')
    expect(ctx.formData.certificateData.template).toBe('<p>x</p>')
  })
})

