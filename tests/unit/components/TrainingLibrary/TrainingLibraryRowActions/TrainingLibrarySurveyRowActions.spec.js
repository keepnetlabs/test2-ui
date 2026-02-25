jest.mock('@/api/awarenessEducator', () => ({
  addToFavorite: jest.fn().mockResolvedValue({}),
  removeFromFavorite: jest.fn().mockResolvedValue({}),
  duplicateTraining: jest.fn().mockResolvedValue({}),
  deleteTraining: jest.fn().mockResolvedValue({})
}))

import TrainingLibrarySurveyRowActions from '@/components/TrainingLibrary/TrainingLibraryRowActions/TrainingLibrarySurveyRowActions.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('TrainingLibrarySurveyRowActions.vue', () => {
  const mockActions = {
    setSurveyPreviewDialog: jest.fn(),
    setSurveySendModal: jest.fn(),
    setNewSurveyModal: jest.fn(),
    setDeleteDialog: jest.fn(),
    callForData: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(TrainingLibrarySurveyRowActions.name).toBe('TrainingLibrarySurveyRowActions')
  })

  it('handlePreview calls setSurveyPreviewDialog', () => {
    const ctx = { ...mockActions }
    const row = { trainingId: 't1' }
    TrainingLibrarySurveyRowActions.methods.handlePreview.call(ctx, row)
    expect(mockActions.setSurveyPreviewDialog).toHaveBeenCalledWith({
      status: true,
      selectedRow: row
    })
  })

  it('handleEdit calls setNewSurveyModal with edit payload', () => {
    const ctx = { ...mockActions }
    const row = { trainingId: 't1' }
    TrainingLibrarySurveyRowActions.methods.handleEdit.call(ctx, row)
    expect(mockActions.setNewSurveyModal).toHaveBeenCalledWith({
      status: true,
      selectedRow: row,
      isEdit: true,
      isDuplicate: false
    })
  })

  it('handleActionDelete calls setDeleteDialog with survey type', () => {
    const ctx = { ...mockActions }
    const row = { trainingId: 't1' }
    TrainingLibrarySurveyRowActions.methods.handleActionDelete.call(ctx, row)
    expect(mockActions.setDeleteDialog).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Delete Survey Material?',
        type: 'training',
        selectedRow: row
      })
    )
  })

  it('handleDuplicate calls duplicateTraining and callForData', async () => {
    const ctx = { ...mockActions }
    const row = { trainingId: 't1' }
    TrainingLibrarySurveyRowActions.methods.handleDuplicate.call(ctx, row)
    await Promise.resolve()
    expect(AwarenessEducatorService.duplicateTraining).toHaveBeenCalledWith('t1')
    expect(mockActions.callForData).toHaveBeenCalled()
  })
})
