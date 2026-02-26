jest.mock('@/api/awarenessEducator', () => ({
  getEnrollmentFormDetails: jest.fn().mockResolvedValue({
    data: { data: {} }
  })
}))

import TrainingList from '@/views/TrainingList.vue'
import labels from '@/model/constants/labels'
import { TRAINING_TYPES } from '@/components/AwarenessEducator/utils'

describe('TrainingList.vue', () => {
  it('has correct component name', () => {
    expect(TrainingList.name).toBe('TrainingList')
  })

  it('getPosterPreviewDialogTitle returns PosterPreview for poster type', () => {
    const ctx = { posterPreviewDialogType: 'poster' }
    expect(TrainingList.computed.getPosterPreviewDialogTitle.call(ctx)).toBe(labels.PosterPreview)
  })

  it('getPosterPreviewDialogTitle returns DownloadPoster for download type', () => {
    const ctx = { posterPreviewDialogType: 'download' }
    expect(TrainingList.computed.getPosterPreviewDialogTitle.call(ctx)).toBe(labels.DownloadPoster)
  })

  it('getPosterPreviewDialogSubtitle returns empty for poster type', () => {
    const ctx = { posterPreviewDialogType: 'poster', selectedRow: { trainingName: 'Test' } }
    expect(TrainingList.computed.getPosterPreviewDialogSubtitle.call(ctx)).toBe('')
  })

  it('handleDownloadPosterAction sets selectedRow and opens poster download dialog', () => {
    const toggleShowPosterDownloadDialog = jest.fn()
    const ctx = {
      selectedRow: null,
      isShowPosterPreviewDialog: false,
      posterPreviewDialogType: 'poster',
      toggleShowPosterDownloadDialog
    }
    const row = { id: 1 }
    TrainingList.methods.handleDownloadPosterAction.call(ctx, row)
    expect(ctx.selectedRow).toEqual(row)
    expect(toggleShowPosterDownloadDialog).toHaveBeenCalled()
  })

  it('toggleShowPosterPreviewDialog resets type to poster when closing', () => {
    const ctx = {
      posterPreviewDialogType: 'download',
      isShowPosterPreviewDialog: true
    }
    TrainingList.methods.toggleShowPosterPreviewDialog.call(ctx)
    expect(ctx.posterPreviewDialogType).toBe('poster')
    expect(ctx.isShowPosterPreviewDialog).toBe(false)
  })

  it('getPosterPreviewDialogSubtitle returns selected trainingName for download type', () => {
    const ctx = { posterPreviewDialogType: 'download', selectedRow: { trainingName: 'Poster A' } }
    expect(TrainingList.computed.getPosterPreviewDialogSubtitle.call(ctx)).toBe('Poster A')
  })

  it('created calls form details loader', () => {
    const ctx = { callForFormDetails: jest.fn() }
    TrainingList.created.call(ctx)
    expect(ctx.callForFormDetails).toHaveBeenCalledTimes(1)
  })

  it('toggleShowDeleteTrainingDialog handles forceUpdate/unselect and reset while closing', () => {
    const unSelectRow = jest.fn()
    const ctx = {
      getDataAndReRenderTable: jest.fn(),
      $refs: { refTable: { $refs: { refTable: { unSelectRow } } } },
      selectedRow: { id: 9 },
      isShowDeleteTrainingDialog: true
    }

    TrainingList.methods.toggleShowDeleteTrainingDialog.call(ctx, true)
    expect(ctx.getDataAndReRenderTable).toHaveBeenCalledWith(true)
    expect(unSelectRow).toHaveBeenCalledWith({ id: 9 })
    expect(ctx.selectedRow).toBe(null)
    expect(ctx.isShowDeleteTrainingDialog).toBe(false)
  })

  it('toggleShowNewTrainingModal and toggleShowNewPosterModal reset selection/edit on close', () => {
    const ctx = {
      getDataAndReRenderTable: jest.fn(),
      selectedRow: { id: 1 },
      isEdit: true,
      isShowNewTrainingModal: true,
      isShowNewPosterModal: true
    }

    TrainingList.methods.toggleShowNewTrainingModal.call(ctx, false)
    expect(ctx.selectedRow).toBe(null)
    expect(ctx.isEdit).toBe(false)
    expect(ctx.isShowNewTrainingModal).toBe(false)

    ctx.selectedRow = { id: 2 }
    ctx.isEdit = true
    TrainingList.methods.toggleShowNewPosterModal.call(ctx, false)
    expect(ctx.selectedRow).toBe(null)
    expect(ctx.isEdit).toBe(false)
    expect(ctx.isShowNewPosterModal).toBe(false)
  })

  it('getDataAndReRenderTable calls table refresh only when forced', () => {
    const callForData = jest.fn()
    const ctx = { $refs: { refTable: { callForData } } }

    TrainingList.methods.getDataAndReRenderTable.call(ctx, false)
    expect(callForData).not.toHaveBeenCalled()
    TrainingList.methods.getDataAndReRenderTable.call(ctx, true)
    expect(callForData).toHaveBeenCalledTimes(1)
  })

  it('handleEditRowClick opens poster modal for poster and training modal otherwise', () => {
    const toggleShowNewPosterModal = jest.fn()
    const toggleShowNewTrainingModal = jest.fn()
    const ctx = {
      selectedRow: null,
      isEdit: false,
      toggleShowNewPosterModal,
      toggleShowNewTrainingModal
    }

    const posterRow = { type: TRAINING_TYPES.POSTER }
    TrainingList.methods.handleEditRowClick.call(ctx, posterRow)
    expect(ctx.selectedRow).toEqual(posterRow)
    expect(ctx.isEdit).toBe(true)
    expect(toggleShowNewPosterModal).toHaveBeenCalledTimes(1)
    expect(toggleShowNewTrainingModal).not.toHaveBeenCalled()

    const scormRow = { type: TRAINING_TYPES.SCORM }
    TrainingList.methods.handleEditRowClick.call(ctx, scormRow)
    expect(toggleShowNewTrainingModal).toHaveBeenCalledTimes(1)
  })

  it('handlePreviewRowClick routes to preview or poster preview by training type', () => {
    const toggleShowPreviewDialog = jest.fn()
    const toggleShowPosterPreviewDialog = jest.fn()
    const ctx = {
      selectedRow: null,
      toggleShowPreviewDialog,
      toggleShowPosterPreviewDialog
    }

    TrainingList.methods.handlePreviewRowClick.call(ctx, { type: TRAINING_TYPES.SCORM })
    expect(toggleShowPreviewDialog).toHaveBeenCalledTimes(1)
    expect(toggleShowPosterPreviewDialog).not.toHaveBeenCalled()

    TrainingList.methods.handlePreviewRowClick.call(ctx, { type: TRAINING_TYPES.POSTER })
    expect(toggleShowPosterPreviewDialog).toHaveBeenCalledTimes(1)
  })

  it('handleDeleteRowClick and handleSendTrainingRowClick set row and toggle dialogs', () => {
    const toggleShowDeleteTrainingDialog = jest.fn()
    const toggleShowSendTrainingModal = jest.fn()
    const ctx = {
      selectedRow: null,
      toggleShowDeleteTrainingDialog,
      toggleShowSendTrainingModal
    }
    const row = { id: 12 }
    TrainingList.methods.handleDeleteRowClick.call(ctx, row)
    expect(ctx.selectedRow).toEqual(row)
    expect(toggleShowDeleteTrainingDialog).toHaveBeenCalledTimes(1)

    TrainingList.methods.handleSendTrainingRowClick.call(ctx, row)
    expect(toggleShowSendTrainingModal).toHaveBeenCalledTimes(1)
  })

  it('toggleShowSendTrainingModal clears selected row only when closing', () => {
    const ctx = {
      getDataAndReRenderTable: jest.fn(),
      selectedRow: { id: 14 },
      isShowSendTrainingModal: true
    }

    TrainingList.methods.toggleShowSendTrainingModal.call(ctx, false)
    expect(ctx.selectedRow).toBe(null)
    expect(ctx.isShowSendTrainingModal).toBe(false)

    ctx.selectedRow = { id: 15 }
    TrainingList.methods.toggleShowSendTrainingModal.call(ctx, false)
    expect(ctx.selectedRow).toEqual({ id: 15 })
    expect(ctx.isShowSendTrainingModal).toBe(true)
  })
})
