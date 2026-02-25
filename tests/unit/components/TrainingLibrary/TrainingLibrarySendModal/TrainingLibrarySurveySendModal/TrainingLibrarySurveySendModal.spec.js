jest.mock('@/api/awarenessEducator', () => ({
  getTrainingTypeCount: jest.fn(),
  getTraining: jest.fn()
}))

import TrainingLibrarySurveySendModal from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibrarySurveySendModal/TrainingLibrarySurveySendModal.vue'

describe('TrainingLibrarySurveySendModal.vue', () => {
  it('has correct component name', () => {
    expect(TrainingLibrarySurveySendModal.name).toBe('TrainingLibrarySurveySendModal')
  })

  it('getTitle returns Send Survey with selectedRow surveyName', () => {
    const ctx = { selectedRow: { surveyName: 'My Survey' } }
    expect(TrainingLibrarySurveySendModal.computed.getTitle.call(ctx)).toBe(
      'Send Survey - My Survey'
    )
  })
})
