jest.mock('@/api/awarenessEducator', () => ({
  getTrainingTypeCount: jest.fn(),
  getTraining: jest.fn()
}))

import TrainingLibraryInfographicSendModal from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibraryInfographicSendModal/TrainingLibraryInfographicSendModal.vue'

describe('TrainingLibraryInfographicSendModal.vue', () => {
  it('has correct component name', () => {
    expect(TrainingLibraryInfographicSendModal.name).toBe('TrainingLibraryInfographicSendModal')
  })

  it('getTitle returns Send Training with selectedRow name', () => {
    const ctx = { selectedRow: { trainingName: 'My Infographic' } }
    expect(TrainingLibraryInfographicSendModal.computed.getTitle.call(ctx)).toBe(
      'Send Training - My Infographic'
    )
  })
})
