import TrainingLibrarySendInfographicSummary from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibraryInfographicSendModal/TrainingLibrarySendInfographicSummary.vue'

describe('TrainingLibrarySendInfographicSummary.vue', () => {
  it('has correct component name', () => {
    expect(TrainingLibrarySendInfographicSummary.name).toBe('TrainingLibrarySendInfographicSummary')
  })

  it('getSettingItems returns formData settings', () => {
    const ctx = { formData: { settings: {} } }
    expect(TrainingLibrarySendInfographicSummary.computed.getSettingItems.call(ctx)).toEqual({})
  })
})
