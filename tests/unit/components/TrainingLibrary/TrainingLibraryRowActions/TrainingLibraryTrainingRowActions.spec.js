jest.mock('@/api/awarenessEducator', () => ({
  addToFavorite: jest.fn().mockResolvedValue({}),
  removeFromFavorite: jest.fn().mockResolvedValue({}),
  duplicateTraining: jest.fn().mockResolvedValue({}),
  deleteTraining: jest.fn().mockResolvedValue({})
}))

import TrainingLibraryTrainingRowActions from '@/components/TrainingLibrary/TrainingLibraryRowActions/TrainingLibraryTrainingRowActions.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('TrainingLibraryTrainingRowActions.vue', () => {
  const mockActions = {
    setTrainingPreviewDialog: jest.fn(),
    setTrainingSendModal: jest.fn(),
    setNewTrainingModal: jest.fn(),
    setDeleteDialog: jest.fn(),
    callForData: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(TrainingLibraryTrainingRowActions.name).toBe('TrainingLibraryTrainingRowActions')
  })

  it('handlePreview calls setTrainingPreviewDialog', () => {
    const ctx = { ...mockActions }
    const row = { trainingId: 't1' }
    TrainingLibraryTrainingRowActions.methods.handlePreview.call(ctx, row)
    expect(mockActions.setTrainingPreviewDialog).toHaveBeenCalledWith({
      status: true,
      selectedRow: row
    })
  })

  it('handleSend calls setTrainingSendModal', () => {
    const ctx = { ...mockActions }
    const row = { trainingId: 't1' }
    TrainingLibraryTrainingRowActions.methods.handleSend.call(ctx, row)
    expect(mockActions.setTrainingSendModal).toHaveBeenCalledWith({
      status: true,
      selectedRow: row
    })
  })

  it('handleEdit calls setNewTrainingModal with edit payload', () => {
    const ctx = { ...mockActions }
    const row = { trainingId: 't1' }
    TrainingLibraryTrainingRowActions.methods.handleEdit.call(ctx, row)
    expect(mockActions.setNewTrainingModal).toHaveBeenCalledWith({
      status: true,
      selectedRow: row,
      isEdit: true,
      isDuplicate: false
    })
  })

  it('handleActionDelete calls setDeleteDialog with training type', () => {
    const ctx = { ...mockActions }
    const row = { trainingId: 't1' }
    TrainingLibraryTrainingRowActions.methods.handleActionDelete.call(ctx, row)
    expect(mockActions.setDeleteDialog).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Delete Training Material?',
        type: 'training',
        selectedRow: row
      })
    )
  })
})
