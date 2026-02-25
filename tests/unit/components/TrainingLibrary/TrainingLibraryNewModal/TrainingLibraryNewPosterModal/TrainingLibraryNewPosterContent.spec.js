jest.mock('@/api/awarenessEducator', () => ({
  deleteTrainingFile: jest.fn(() => Promise.resolve())
}))

import TrainingLibraryNewPosterContent from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewPosterModal/TrainingLibraryNewPosterContent.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('TrainingLibraryNewPosterContent.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('isRenderAddLanguage is true when there are remaining languages', () => {
    const getLanguages = [{ id: 'en' }, { id: 'tr' }]
    const result = TrainingLibraryNewPosterContent.computed.isRenderAddLanguage.call({
      getLanguages,
      formData: { contentByLanguage: [{ languageId: 'en' }] }
    })
    expect(result).toBe(true)
  })

  it('setTrainingContents maps content items', () => {
    const ctx = { formData: { contentByLanguage: [] } }
    TrainingLibraryNewPosterContent.methods.setTrainingContents.call(ctx, [
      { languageId: 'en', name: 'poster.pdf', size: 1, typeWithDisplayName: 'PDF', isDeleteable: false }
    ])
    expect(ctx.formData.contentByLanguage[0].filePreviews[0].name).toBe('poster.pdf')
    expect(ctx.formData.contentByLanguage[0].isDeleteable).toBe(true)
  })

  it('handleAddLanguage pushes new content entry', () => {
    const ctx = {
      formData: { contentByLanguage: [] },
      languages: [{ value: 'en', isDisabled: false }]
    }
    TrainingLibraryNewPosterContent.methods.handleAddLanguage.call(ctx)
    expect(ctx.formData.contentByLanguage).toHaveLength(1)
    expect(ctx.formData.contentByLanguage[0].languageId).toBe('en')
  })

  it('handleRemove calls deleteTrainingFile for existing file', async () => {
    const ctx = {
      resourceId: 'r1',
      formData: { contentByLanguage: [{ languageId: 'en', filePreviews: [{ name: 'x.pdf' }] }] }
    }
    TrainingLibraryNewPosterContent.methods.handleRemove.call(ctx, 0)
    await Promise.resolve()
    expect(AwarenessEducatorService.deleteTrainingFile).toHaveBeenCalledWith('r1', 'en')
  })

  it('handleRemove splices without API when no file', () => {
    const ctx = {
      formData: { contentByLanguage: [{ languageId: 'en' }, { languageId: 'tr' }] }
    }
    TrainingLibraryNewPosterContent.methods.handleRemove.call(ctx, 0)
    expect(ctx.formData.contentByLanguage).toHaveLength(1)
    expect(ctx.formData.contentByLanguage[0].languageId).toBe('tr')
    expect(AwarenessEducatorService.deleteTrainingFile).not.toHaveBeenCalled()
  })
})
