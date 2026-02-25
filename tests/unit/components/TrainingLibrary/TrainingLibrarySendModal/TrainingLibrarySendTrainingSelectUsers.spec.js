import TrainingLibrarySendTrainingSelectUsers from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibrarySendTrainingSelectUsers.vue'

describe('TrainingLibrarySendTrainingSelectUsers.vue', () => {
  it('has correct component name', () => {
    expect(TrainingLibrarySendTrainingSelectUsers.name).toBe('TrainingLibrarySendTrainingSelectUsers')
  })

  it('isProxy prop defaults to false', () => {
    expect(TrainingLibrarySendTrainingSelectUsers.props.isProxy.default).toBe(false)
  })

  it('isSurvey prop defaults to false', () => {
    expect(TrainingLibrarySendTrainingSelectUsers.props.isSurvey.default).toBe(false)
  })
})
