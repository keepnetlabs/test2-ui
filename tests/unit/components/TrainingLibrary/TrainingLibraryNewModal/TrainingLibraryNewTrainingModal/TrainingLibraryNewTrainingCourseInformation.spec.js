import TrainingLibraryNewTrainingCourseInformation from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewTrainingModal/TrainingLibraryNewTrainingCourseInformation.vue'

describe('TrainingLibraryNewTrainingCourseInformation.vue', () => {
  it('setFormData sets coverImageUrl from coverImage', () => {
    const ctx = { formData: { coverImageUrl: null, name: '' } }
    TrainingLibraryNewTrainingCourseInformation.methods.setFormData.call(ctx, {
      coverImage: { imageUrl: 'https://cdn.test/cover.png' },
      name: 'Training A'
    })
    expect(ctx.formData.coverImageUrl).toBe('https://cdn.test/cover.png')
    expect(ctx.formData.name).toBe('Training A')
  })

  it('setMakeAvailableForData uses fallback when backend mapping empty', () => {
    const ctx = {
      formData: { availableForRequests: [] },
      $refs: {
        refMakeAvailableFor: { getAvailableForListFromBackend: jest.fn(() => []) }
      }
    }
    TrainingLibraryNewTrainingCourseInformation.methods.setMakeAvailableForData.call(ctx, [{ id: 1 }])
    expect(ctx.formData.availableForRequests[0].type).toBe('MyCompanyOnly')
  })
})

