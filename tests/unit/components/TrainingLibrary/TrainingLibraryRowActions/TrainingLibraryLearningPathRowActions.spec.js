jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    addToFavorite: jest.fn(() => Promise.resolve()),
    removeFromFavorite: jest.fn(() => Promise.resolve()),
    duplicateTraining: jest.fn(() => Promise.resolve()),
    deleteTraining: jest.fn()
  }
}))

import TrainingLibraryLearningPathRowActions from '@/components/TrainingLibrary/TrainingLibraryRowActions/TrainingLibraryLearningPathRowActions.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('TrainingLibraryLearningPathRowActions.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handleSend opens send modal with selected row', () => {
    const setLearningPathSendModal = jest.fn()
    TrainingLibraryLearningPathRowActions.methods.handleSend.call(
      { setLearningPathSendModal },
      { trainingId: 't2' }
    )
    expect(setLearningPathSendModal).toHaveBeenCalledWith({
      status: true,
      selectedRow: { trainingId: 't2' }
    })
  })

  it('handleDuplicate duplicates training and refreshes list', async () => {
    const ctx = { callForData: jest.fn() }
    TrainingLibraryLearningPathRowActions.methods.handleDuplicate.call(ctx, { trainingId: 't2' })
    await Promise.resolve()
    expect(AwarenessEducatorService.duplicateTraining).toHaveBeenCalledWith('t2')
    expect(ctx.callForData).toHaveBeenCalled()
  })
})

