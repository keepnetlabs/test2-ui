jest.mock('@/api/awarenessEducator', () => ({
  getEnrollmentFormDetails: jest.fn().mockResolvedValue({
    data: { data: {} }
  })
}))

import TrainingList from '@/views/TrainingList.vue'
import labels from '@/model/constants/labels'

describe('TrainingList.vue', () => {
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
})
