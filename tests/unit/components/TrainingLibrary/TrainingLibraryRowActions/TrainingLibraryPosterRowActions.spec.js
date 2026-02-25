jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    addToFavorite: jest.fn(() => Promise.resolve()),
    removeFromFavorite: jest.fn(() => Promise.resolve()),
    duplicateTraining: jest.fn(() => Promise.resolve()),
    deleteTraining: jest.fn()
  }
}))

import TrainingLibraryPosterRowActions from '@/components/TrainingLibrary/TrainingLibraryRowActions/TrainingLibraryPosterRowActions.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('TrainingLibraryPosterRowActions.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handleEdit opens new poster modal in edit mode', () => {
    const setNewPosterModal = jest.fn()
    TrainingLibraryPosterRowActions.methods.handleEdit.call(
      { setNewPosterModal },
      { trainingId: 't3' }
    )
    expect(setNewPosterModal).toHaveBeenCalledWith({
      status: true,
      selectedRow: { trainingId: 't3' },
      isEdit: true,
      isDuplicate: false
    })
  })

  it('handleAddFavorite adds when not favorite', async () => {
    const ctx = { callForData: jest.fn() }
    TrainingLibraryPosterRowActions.methods.handleAddFavorite.call(ctx, {
      trainingId: 't3',
      isFavourite: false
    })
    await Promise.resolve()
    expect(AwarenessEducatorService.addToFavorite).toHaveBeenCalledWith('t3')
    expect(ctx.callForData).toHaveBeenCalled()
  })
})

