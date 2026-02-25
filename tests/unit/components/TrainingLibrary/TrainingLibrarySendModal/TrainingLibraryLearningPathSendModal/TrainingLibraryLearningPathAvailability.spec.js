import TrainingLibraryLearningPathAvailability from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibraryLearningPathSendModal/TrainingLibraryLearningPathAvailability.vue'

describe('TrainingLibraryLearningPathAvailability.vue', () => {
  it('has correct component name', () => {
    expect(TrainingLibraryLearningPathAvailability.name).toBe('TrainingLibraryLearningPathAvailability')
  })

  it('value prop has default with startDate and dueDate', () => {
    const defaultVal = TrainingLibraryLearningPathAvailability.props.value.default()
    expect(defaultVal).toHaveProperty('startDate')
    expect(defaultVal).toHaveProperty('dueDate')
  })
})
