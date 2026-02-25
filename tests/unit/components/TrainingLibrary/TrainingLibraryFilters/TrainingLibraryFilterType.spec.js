import TrainingLibraryFilterType from '@/components/TrainingLibrary/TrainingLibraryFilters/TrainingLibraryFilterType.vue'

describe('TrainingLibraryFilterType.vue', () => {
  it('handleSetFilter emits and calls setFilterType', () => {
    const emit = jest.fn()
    const setFilterType = jest.fn()
    TrainingLibraryFilterType.methods.handleSetFilter.call(
      { $emit: emit, setFilterType },
      'And'
    )
    expect(emit).toHaveBeenCalledWith('on-filter-selected')
    expect(setFilterType).toHaveBeenCalledWith('And')
  })
})
