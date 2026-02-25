import TrainingLibrarySendInfographicSettings from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibraryInfographicSendModal/TrainingLibrarySendInfographicSettings.vue'

describe('TrainingLibrarySendInfographicSettings.vue', () => {
  it('has correct component name', () => {
    expect(TrainingLibrarySendInfographicSettings.name).toBe('TrainingLibrarySendInfographicSettings')
  })

  it('selectedRow prop is required', () => {
    expect(TrainingLibrarySendInfographicSettings.props.selectedRow).toBeDefined()
  })
})
