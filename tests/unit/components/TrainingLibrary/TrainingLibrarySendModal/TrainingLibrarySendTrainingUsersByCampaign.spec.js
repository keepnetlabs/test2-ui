import TrainingLibrarySendTrainingUsersByCampaign from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibrarySendTrainingUsersByCampaign.vue'

describe('TrainingLibrarySendTrainingUsersByCampaign.vue', () => {
  it('languageItems maps helper languages into select items', () => {
    const items = TrainingLibrarySendTrainingUsersByCampaign.computed.languageItems.call({
      languages: [{ name: 'English', code: 'en' }, { name: 'Turkish', code: 'tr' }]
    })
    expect(items).toEqual([
      { text: 'English', value: 'en' },
      { text: 'Turkish', value: 'tr' }
    ])
  })

  it('getTableEmptyTextMessage returns no-result text when filter active', () => {
    const text = TrainingLibrarySendTrainingUsersByCampaign.computed.getTableEmptyTextMessage.call({
      isFilterOrSearchActive: true
    })
    expect(text.toLowerCase()).toContain('no results')
  })
})
