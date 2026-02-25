jest.mock('@/api/awarenessEducator', () => ({
  deleteTrainingFile: jest.fn(() => Promise.resolve())
}))

import TrainingLibraryNewTrainingContent from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewTrainingModal/TrainingLibraryNewTrainingContent.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('TrainingLibraryNewTrainingContent.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('isRenderAddLanguage is true when there are remaining languages', () => {
    const result = TrainingLibraryNewTrainingContent.computed.isRenderAddLanguage.call({
      languages: [{ value: 'en' }, { value: 'tr' }],
      formData: { contentByLanguage: [{ languageId: 'en' }] }
    })
    expect(result).toBe(true)
  })

  it('setTrainingContents maps content items', () => {
    const ctx = { formData: { contentByLanguage: [] } }
    TrainingLibraryNewTrainingContent.methods.setTrainingContents.call(ctx, [
      { languageId: 'en', name: 'f.zip', size: 1, typeWithDisplayName: 'SCORM', isDeleteable: false }
    ])
    expect(ctx.formData.contentByLanguage[0].filePreviews[0].name).toBe('f.zip')
    expect(ctx.formData.contentByLanguage[0].isDeleteable).toBe(true)
  })

  it('handleRemove calls deleteTrainingFile for existing file', async () => {
    const ctx = {
      resourceId: 't1',
      formData: { contentByLanguage: [{ languageId: 'en', filePreviews: [{ name: 'x' }] }] }
    }
    TrainingLibraryNewTrainingContent.methods.handleRemove.call(ctx, 0)
    await Promise.resolve()
    expect(AwarenessEducatorService.deleteTrainingFile).toHaveBeenCalledWith('t1', 'en')
  })
})

