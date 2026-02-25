jest.mock('@/api/awarenessEducator', () => ({
  deleteTrainingFile: jest.fn(() => Promise.resolve())
}))

import TrainingLibraryNewSurveyContent from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewSurveyModal/TrainingLibraryNewSurveyContent.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('TrainingLibraryNewSurveyContent.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handleAddLanguage adds first available language', () => {
    const ctx = {
      formData: { contentByLanguage: [{ languageId: 'en' }] },
      languages: [
        { value: 'en', isDisabled: true },
        { value: 'tr', isDisabled: false }
      ]
    }
    TrainingLibraryNewSurveyContent.methods.handleAddLanguage.call(ctx)
    expect(ctx.formData.contentByLanguage[1]).toEqual({ file: null, languageId: 'tr' })
  })

  it('setTrainingContents maps backend content and inverts deleteable flag', () => {
    const ctx = { formData: { contentByLanguage: [] } }
    TrainingLibraryNewSurveyContent.methods.setTrainingContents.call(ctx, [
      {
        languageId: 'en',
        name: 'f.zip',
        size: 12,
        typeWithDisplayName: 'SCORM',
        isDeleteable: true,
        warningMessage: 'x'
      }
    ])
    expect(ctx.formData.contentByLanguage[0].isDeleteable).toBe(false)
  })

  it('handleRemove calls delete API when file preview exists', async () => {
    const ctx = {
      resourceId: 't1',
      formData: { contentByLanguage: [{ languageId: 'en', filePreviews: [{ name: 'x' }] }] }
    }
    TrainingLibraryNewSurveyContent.methods.handleRemove.call(ctx, 0)
    await Promise.resolve()
    expect(AwarenessEducatorService.deleteTrainingFile).toHaveBeenCalledWith('t1', 'en')
  })
})

