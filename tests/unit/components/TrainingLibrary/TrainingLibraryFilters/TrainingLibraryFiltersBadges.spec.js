import TrainingLibraryFiltersBadges from '@/components/TrainingLibrary/TrainingLibraryFilters/TrainingLibraryFiltersBadges.vue'

describe('TrainingLibraryFiltersBadges.vue', () => {
  it('isRenderFilters returns true when any filter is active', () => {
    expect(
      TrainingLibraryFiltersBadges.computed.isRenderFilters.call({
        getFilters: [{ isFilterActive: false }, { isFilterActive: true }]
      })
    ).toBe(true)
  })

  it('isRenderFilters returns false when no filter is active', () => {
    expect(
      TrainingLibraryFiltersBadges.computed.isRenderFilters.call({
        getFilters: [{ isFilterActive: false }]
      })
    ).toBe(false)
  })
})
