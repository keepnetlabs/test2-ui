jest.mock('@/api/awarenessEducator', () => ({
  addToFavorite: jest.fn().mockResolvedValue({}),
  removeFromFavorite: jest.fn().mockResolvedValue({}),
  duplicateTraining: jest.fn().mockResolvedValue({}),
  deleteTraining: jest.fn().mockResolvedValue({})
}))

import TrainingLibraryScreensaverRowActions from '@/components/TrainingLibrary/TrainingLibraryRowActions/TrainingLibraryScreensaverRowActions.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import labels from '@/model/constants/labels'

describe('TrainingLibraryScreensaverRowActions.vue', () => {
  const mockScope = { row: { trainingId: 't1', isFavourite: false, isEditable: true } }
  const mockActions = {
    setScreenSaverPreviewDialog: jest.fn(),
    setScreensaverSendModal: jest.fn(),
    setNewScreensaverModal: jest.fn(),
    setDeleteDialog: jest.fn(),
    callForData: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(TrainingLibraryScreensaverRowActions.name).toBe('TrainingLibraryScreensaverRowActions')
  })

  it('handlePreview calls setScreenSaverPreviewDialog with correct payload', () => {
    const ctx = { ...mockActions }
    const row = { trainingId: 't1' }
    TrainingLibraryScreensaverRowActions.methods.handlePreview.call(ctx, row)
    expect(mockActions.setScreenSaverPreviewDialog).toHaveBeenCalledWith({
      status: true,
      selectedRow: row,
      type: 'screensaver',
      title: labels.ScreensaverPreview,
      subtitle: '',
      showDetails: true,
      showTabs: true,
      showSendButton: false,
      showScreensaverName: true,
      showFavoriteButton: true,
      icon: 'mdi-eye'
    })
  })

  it('handleEdit calls setNewScreensaverModal with edit payload', () => {
    const ctx = { ...mockActions }
    const row = { trainingId: 't1' }
    TrainingLibraryScreensaverRowActions.methods.handleEdit.call(ctx, row)
    expect(mockActions.setNewScreensaverModal).toHaveBeenCalledWith({
      status: true,
      selectedRow: row,
      isEdit: true,
      isDuplicate: false
    })
  })

  it('handleActionDelete calls setDeleteDialog with screensaver type', () => {
    const emit = jest.fn()
    const ctx = { ...mockActions, $emit: emit }
    const row = { trainingId: 't1' }
    TrainingLibraryScreensaverRowActions.methods.handleActionDelete.call(ctx, row)
    expect(mockActions.setDeleteDialog).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Delete Screensaver Material?',
        type: 'screensaver',
        selectedRow: row
      })
    )
  })

  it('handleAddFavorite calls addToFavorite when not favourite', async () => {
    const ctx = { ...mockActions }
    const row = { trainingId: 't1', isFavourite: false }
    TrainingLibraryScreensaverRowActions.methods.handleAddFavorite.call(ctx, row)
    await Promise.resolve()
    expect(AwarenessEducatorService.addToFavorite).toHaveBeenCalledWith('t1')
    expect(mockActions.callForData).toHaveBeenCalled()
  })

  it('handleAddFavorite calls removeFromFavorite when favourite', async () => {
    const ctx = { ...mockActions }
    const row = { trainingId: 't1', isFavourite: true }
    TrainingLibraryScreensaverRowActions.methods.handleAddFavorite.call(ctx, row)
    await Promise.resolve()
    expect(AwarenessEducatorService.removeFromFavorite).toHaveBeenCalledWith('t1')
  })
})
