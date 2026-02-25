import NewTrainingCourseInformation from '@/components/AwarenessEducator/NewTraining/NewTrainingCourseInformation.vue'

describe('NewTrainingCourseInformation.vue', () => {
  it('data initializes expected defaults', () => {
    const data = NewTrainingCourseInformation.data.call({})
    expect(data.formData.name).toBe('')
    expect(data.formData.coverImage).toBe(null)
    expect(data.formData.availableForRequests).toEqual([])
  })

  it('setFormData merges data into formData', () => {
    const ctx = {
      formData: {
        name: 'old',
        category: 'old-category',
        tags: []
      }
    }
    NewTrainingCourseInformation.methods.setFormData.call(ctx, {
      name: 'new',
      tags: ['tag-1']
    })
    expect(ctx.formData).toEqual({
      name: 'new',
      category: 'old-category',
      tags: ['tag-1']
    })
  })
})
