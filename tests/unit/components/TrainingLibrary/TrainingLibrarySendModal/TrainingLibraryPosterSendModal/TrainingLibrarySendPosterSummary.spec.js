import TrainingLibrarySendPosterSummary from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibraryPosterSendModal/TrainingLibrarySendPosterSummary.vue'

describe('TrainingLibrarySendPosterSummary.vue', () => {
  it('getCardTitle uses poster name', () => {
    const title = TrainingLibrarySendPosterSummary.computed.getCardTitle.call({
      formData: { trainingData: { name: 'Poster A' } }
    })
    expect(title).toContain('Poster A')
  })

  it('handleReminderLanguageChange updates reminder template selection', () => {
    const ctx = {
      formData: {
        reminderData: {
          selectedLanguageResourceId: '',
          selectedLanguageName: '',
          template: '',
          languages: [
            { languageTypeResourceId: 'en', languageTypeName: 'English', template: '<p>en</p>' }
          ]
        }
      }
    }
    TrainingLibrarySendPosterSummary.methods.handleReminderLanguageChange.call(ctx, 'en')
    expect(ctx.formData.reminderData.selectedLanguageName).toBe('English')
    expect(ctx.formData.reminderData.template).toBe('<p>en</p>')
  })
})

