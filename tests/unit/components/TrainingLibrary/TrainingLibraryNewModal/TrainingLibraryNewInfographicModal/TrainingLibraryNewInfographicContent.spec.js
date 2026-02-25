jest.mock('@/api/awarenessEducator', () => ({
  deleteTrainingFile: jest.fn(() => Promise.resolve())
}))

import TrainingLibraryNewInfographicContent from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewInfographicModal/TrainingLibraryNewInfographicContent.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('TrainingLibraryNewInfographicContent.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('isRenderAddLanguage is true when there are remaining languages', () => {
    const getLanguages = [{ id: 'en' }, { id: 'tr' }]
    const result = TrainingLibraryNewInfographicContent.computed.isRenderAddLanguage.call({
      getLanguages,
      formData: { contentByLanguage: [{ languageId: 'en' }] }
    })
    expect(result).toBe(true)
  })

  it('setTrainingContents maps backend content list', () => {
    const ctx = { formData: { contentByLanguage: [] } }
    TrainingLibraryNewInfographicContent.methods.setTrainingContents.call(ctx, [
      {
        languageId: 'en',
        name: 'infographic.pdf',
        size: 10,
        typeWithDisplayName: 'PDF',
        isDeleteable: false,
        warningMessage: 'x'
      }
    ])
    expect(ctx.formData.contentByLanguage[0].filePreviews[0].name).toBe('infographic.pdf')
    expect(ctx.formData.contentByLanguage[0].isDeleteable).toBe(true)
  })

  it('handleAddLanguage pushes next available language', () => {
    const ctx = {
      formData: { contentByLanguage: [] },
      languages: [{ value: 'en', isDisabled: false }]
    }
    TrainingLibraryNewInfographicContent.methods.handleAddLanguage.call(ctx)
    expect(ctx.formData.contentByLanguage[0].languageId).toBe('en')
  })

  it('handleRemove calls deleteTrainingFile when file exists', async () => {
    const ctx = {
      resourceId: 'r1',
      formData: { contentByLanguage: [{ languageId: 'en', filePreviews: [{ name: 'x.pdf' }] }] }
    }
    TrainingLibraryNewInfographicContent.methods.handleRemove.call(ctx, 0)
    await Promise.resolve()
    expect(AwarenessEducatorService.deleteTrainingFile).toHaveBeenCalledWith('r1', 'en')
  })
})
