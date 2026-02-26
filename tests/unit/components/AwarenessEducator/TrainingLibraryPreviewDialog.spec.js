jest.mock('@/api/awarenessEducator', () => ({
  getLanguages: jest.fn(() => Promise.resolve({ data: { data: [] } })),
  getTraining: jest.fn(() => Promise.resolve({ data: { data: {} } }))
}))

import TrainingLibraryPreviewDialog from '@/components/AwarenessEducator/TrainingLibraryPreviewDialog.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

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

  it('getTrainingParams returns prop trainingParams when callApi is false', () => {
    const value = TrainingLibraryPreviewDialog.computed.getTrainingParams.call({
      trainingParams: { name: 'from-prop' },
      callApi: false,
      trainingDetails: { name: 'from-api' }
    })
    expect(value).toEqual({ name: 'from-prop' })
  })

  it('getTrainingParams returns trainingDetails when trainingParams is missing', () => {
    const value = TrainingLibraryPreviewDialog.computed.getTrainingParams.call({
      trainingParams: null,
      callApi: false,
      trainingDetails: { name: 'fallback' }
    })
    expect(value).toEqual({ name: 'fallback' })
  })

  it('created calls callForLanguages only when callApi=true', () => {
    const callForLanguages = jest.fn()
    TrainingLibraryPreviewDialog.created.call({ callApi: true, callForLanguages })
    expect(callForLanguages).toHaveBeenCalledTimes(1)

    callForLanguages.mockClear()
    TrainingLibraryPreviewDialog.created.call({ callApi: false, callForLanguages })
    expect(callForLanguages).not.toHaveBeenCalled()
  })

  it('callForLanguages maps only matching ids into selectedLanguages and calls detail loader', async () => {
    AwarenessEducatorService.getLanguages.mockResolvedValueOnce({
      data: {
        data: [
          { id: 'en', name: 'English', isoFriendlyName: 'English (US)' },
          { id: 'tr', name: 'Turkish', isoFriendlyName: '' }
        ]
      }
    })
    const callForTrainingDetail = jest.fn()
    const ctx = {
      isPreviewLoading: false,
      selectedLanguages: [],
      selectedRow: { trainingLanguageIds: ['en', 'xx', 'tr'] },
      callForTrainingDetail
    }

    TrainingLibraryPreviewDialog.methods.callForLanguages.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.isPreviewLoading).toBe(true)
    expect(ctx.selectedLanguages).toEqual([
      { text: 'English (US)', value: 'en' },
      { text: 'Turkish', value: 'tr' }
    ])
    expect(callForTrainingDetail).toHaveBeenCalled()
  })

  it('callForTrainingDetail sets trainingDetails with joined languages', async () => {
    AwarenessEducatorService.getTraining.mockResolvedValueOnce({
      data: {
        data: { name: 'Secure Training', createdBy: 'Admin' }
      }
    })
    const ctx = {
      selectedRow: { trainingId: 'training-1' },
      selectedLanguages: [{ text: 'EN' }, { text: 'TR' }],
      trainingDetails: null
    }

    TrainingLibraryPreviewDialog.methods.callForTrainingDetail.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.trainingDetails).toEqual(
      expect.objectContaining({
        name: 'Secure Training',
        languages: 'EN, TR'
      })
    )
  })
})
