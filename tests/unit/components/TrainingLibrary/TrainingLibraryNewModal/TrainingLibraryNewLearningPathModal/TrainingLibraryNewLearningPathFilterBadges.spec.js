import TrainingLibraryNewLearningPathFilterBadges from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewLearningPathModal/TrainingLibraryNewLearningPathFilterBadges.vue'

describe('TrainingLibraryNewLearningPathFilterBadges.vue', () => {
  it('isRenderFilters returns true when an active filter exists', () => {
    const value = TrainingLibraryNewLearningPathFilterBadges.computed.isRenderFilters.call({
      getFilters: [{ isFilterActive: false }, { isFilterActive: true }]
    })
    expect(value).toBe(true)
  })

  it('isRenderFilters returns false when all filters are passive', () => {
    const value = TrainingLibraryNewLearningPathFilterBadges.computed.isRenderFilters.call({
      getFilters: [{ isFilterActive: false }]
    })
    expect(value).toBe(false)
  })
})
