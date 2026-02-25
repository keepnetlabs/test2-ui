jest.mock('@/api/awarenessEducator', () => ({
  deleteTrainingFile: jest.fn(() => Promise.resolve())
}))

import TrainingLibraryNewScreensaverContent from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewScreensaverModal/TrainingLibraryNewScreensaverContent.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('TrainingLibraryNewScreensaverContent.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('isRenderAddLanguage is true when there are remaining languages', () => {
    const getLanguages = [{ id: 'en' }, { id: 'tr' }]
    const result = TrainingLibraryNewScreensaverContent.computed.isRenderAddLanguage.call({
      getLanguages,
      formData: { contentByLanguage: [{ languageId: 'en' }] }
    })
    expect(result).toBe(true)
  })

  it('setTrainingContents maps content items', () => {
    const ctx = { formData: { contentByLanguage: [] } }
    TrainingLibraryNewScreensaverContent.methods.setTrainingContents.call(ctx, [
      {
        languageId: 'en',
        name: 'screensaver.pdf',
        size: 1,
        typeWithDisplayName: 'PDF',
        isDeleteable: false
      }
    ])
    expect(ctx.formData.contentByLanguage[0].filePreviews[0].name).toBe('screensaver.pdf')
    expect(ctx.formData.contentByLanguage[0].isDeleteable).toBe(true)
  })

  it('handleAddLanguage pushes new content entry', () => {
    const ctx = {
      formData: { contentByLanguage: [] },
      languages: [{ value: 'en', isDisabled: false }]
    }
    TrainingLibraryNewScreensaverContent.methods.handleAddLanguage.call(ctx)
    expect(ctx.formData.contentByLanguage).toHaveLength(1)
    expect(ctx.formData.contentByLanguage[0].languageId).toBe('en')
  })

  it('handleRemove calls deleteTrainingFile for existing file', async () => {
    const ctx = {
      resourceId: 'r1',
      formData: { contentByLanguage: [{ languageId: 'en', filePreviews: [{ name: 'x.pdf' }] }] }
    }
    TrainingLibraryNewScreensaverContent.methods.handleRemove.call(ctx, 0)
    await Promise.resolve()
    expect(AwarenessEducatorService.deleteTrainingFile).toHaveBeenCalledWith('r1', 'en')
  })
})
