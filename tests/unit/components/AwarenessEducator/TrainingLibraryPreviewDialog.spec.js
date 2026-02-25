jest.mock('@/api/awarenessEducator', () => ({
  getLanguages: jest.fn(() => Promise.resolve({ data: { data: [] } })),
  getTraining: jest.fn(() => Promise.resolve({ data: { data: {} } }))
}))

import TrainingLibraryPreviewDialog from '@/components/AwarenessEducator/TrainingLibraryPreviewDialog.vue'

describe('TrainingLibraryPreviewDialog.vue', () => {
  it('getTrainingParams returns trainingDetails when callApi true', () => {
    const value = TrainingLibraryPreviewDialog.computed.getTrainingParams.call({
      trainingParams: { name: 'x' },
      callApi: true,
      trainingDetails: { name: 'from-api' }
    })
    expect(value).toEqual({ name: 'from-api' })
  })

  it('defaultSelectedLanguages watcher sets selectedLanguages', () => {
    const ctx = { selectedLanguages: [] }
    TrainingLibraryPreviewDialog.watch.defaultSelectedLanguages.handler.call(ctx, [{ text: 'EN' }])
    expect(ctx.selectedLanguages).toEqual([{ text: 'EN' }])
  })

  it('handleClose emits close event', () => {
    const $emit = jest.fn()
    TrainingLibraryPreviewDialog.methods.handleClose.call({ $emit })
    expect($emit).toHaveBeenCalled()
  })
})
