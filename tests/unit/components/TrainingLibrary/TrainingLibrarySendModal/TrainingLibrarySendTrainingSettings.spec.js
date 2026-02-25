import TrainingLibrarySendTrainingSettings from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibrarySendTrainingSettings.vue'

describe('TrainingLibrarySendTrainingSettings.vue', () => {
  it('has correct component name', () => {
    expect(TrainingLibrarySendTrainingSettings.name).toBe('TrainingLibrarySendTrainingSettings')
  })

  it('selectedRow prop is required', () => {
    expect(TrainingLibrarySendTrainingSettings.props.selectedRow).toBeDefined()
  })
})
