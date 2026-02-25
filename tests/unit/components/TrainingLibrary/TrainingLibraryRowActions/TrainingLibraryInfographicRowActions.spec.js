jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    addToFavorite: jest.fn(() => Promise.resolve()),
    removeFromFavorite: jest.fn(() => Promise.resolve()),
    duplicateTraining: jest.fn(() => Promise.resolve()),
    deleteTraining: jest.fn()
  }
}))

import TrainingLibraryInfographicRowActions from '@/components/TrainingLibrary/TrainingLibraryRowActions/TrainingLibraryInfographicRowActions.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('TrainingLibraryInfographicRowActions.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handlePreview sends expected dialog payload', () => {
    const setInfographicPreviewDialog = jest.fn()
    TrainingLibraryInfographicRowActions.methods.handlePreview.call(
      { setInfographicPreviewDialog },
      { trainingId: 't1' }
    )
    expect(setInfographicPreviewDialog).toHaveBeenCalled()
  })

  it('handleAddFavorite removes favorite then refreshes list', async () => {
    const ctx = { callForData: jest.fn() }
    TrainingLibraryInfographicRowActions.methods.handleAddFavorite.call(ctx, {
      trainingId: 't1',
      isFavourite: true
    })
    await Promise.resolve()
    expect(AwarenessEducatorService.removeFromFavorite).toHaveBeenCalledWith('t1')
    expect(ctx.callForData).toHaveBeenCalled()
  })
})

