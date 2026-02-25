import TrainingLibraryNewSurveyCourseInformation from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewSurveyModal/TrainingLibraryNewSurveyCourseInformation.vue'

describe('TrainingLibraryNewSurveyCourseInformation.vue', () => {
  it('setFormData sets coverImageUrl from coverImage object', () => {
    const ctx = {
      formData: { coverImageUrl: null, name: '' }
    }
    TrainingLibraryNewSurveyCourseInformation.methods.setFormData.call(ctx, {
      coverImage: { imageUrl: 'https://img.test/a.png' },
      name: 'Survey 1'
    })
    expect(ctx.formData.coverImageUrl).toBe('https://img.test/a.png')
    expect(ctx.formData.name).toBe('Survey 1')
  })

  it('setMakeAvailableForData falls back to MyCompanyOnly', () => {
    const ctx = {
      formData: { availableForRequests: [] },
      $refs: {
        refMakeAvailableFor: { getAvailableForListFromBackend: jest.fn(() => []) }
      }
    }
    TrainingLibraryNewSurveyCourseInformation.methods.setMakeAvailableForData.call(ctx, [{ id: 1 }])
    expect(ctx.formData.availableForRequests[0].type).toBe('MyCompanyOnly')
  })

  it('handleGenerate sets generated description when service returns text', async () => {
    const ctx = {
      isGenerateDisabled: false,
      isGenerateLoading: false,
      hasGenerationError: false,
      hasGenerated: false,
      formData: { name: 'N', category: 'C', roleIds: ['r1'], description: '' },
      generateAIDescription: jest.fn(async () => 'generated text')
    }
    await TrainingLibraryNewSurveyCourseInformation.methods.handleGenerate.call(ctx)
    expect(ctx.formData.description).toBe('generated text')
    expect(ctx.hasGenerated).toBe(true)
  })
})

