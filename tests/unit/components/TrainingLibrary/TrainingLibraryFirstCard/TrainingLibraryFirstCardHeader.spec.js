jest.mock('@/api/awarenessEducator', () => ({
  exportTrainingList: jest.fn(() => Promise.resolve({ data: 'mock-file' }))
}))

import TrainingLibraryFirstCardHeader from '@/components/TrainingLibrary/TrainingLibraryFirstCard/TrainingLibraryFirstCardHeader.vue'
import { downloadButtonOptions } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

describe('TrainingLibraryFirstCardHeader.vue', () => {
  it('handleDownloadButtonClick sets modal visible', () => {
    const ctx = { isShowDownloadModal: false, downloadModalTitle: '' }
    TrainingLibraryFirstCardHeader.methods.handleDownloadButtonClick.call(ctx, 'Excel')
    expect(ctx.isShowDownloadModal).toBe(true)
    expect(ctx.downloadModalTitle).toBe('Excel')
  })

  it('toggleDownloadModal toggles isShowDownloadModal', () => {
    const ctx = { isShowDownloadModal: false }
    TrainingLibraryFirstCardHeader.methods.toggleDownloadModal.call(ctx)
    expect(ctx.isShowDownloadModal).toBe(true)
    TrainingLibraryFirstCardHeader.methods.toggleDownloadModal.call(ctx)
    expect(ctx.isShowDownloadModal).toBe(false)
  })

  it('downloadButtonOptions from utils', () => {
    expect(TrainingLibraryFirstCardHeader.data().downloadButtonOptions).toEqual(downloadButtonOptions)
  })
})
