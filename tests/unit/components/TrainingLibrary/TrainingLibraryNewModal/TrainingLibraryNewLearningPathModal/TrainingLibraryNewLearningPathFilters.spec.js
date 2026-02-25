import TrainingLibraryNewLearningPathFilters from '@/components/TrainingLibrary/TrainingLibraryNewModal/TrainingLibraryNewLearningPathModal/TrainingLibraryNewLearningPathFilters.vue'

describe('TrainingLibraryNewLearningPathFilters.vue', () => {
  it('getTotalFilterLength returns count of visible filters', () => {
    const count = TrainingLibraryNewLearningPathFilters.computed.getTotalFilterLength.call({
      filters: [{ show: true }, { show: false }, { show: true }]
    })
    expect(count).toBe(2)
  })

  it('handleClearFilter resets search filter and removes payload', () => {
    const removeFilterFromPayload = jest.fn()
    const filter = {
      filterType: 'search',
      isFilterActive: true,
      value: ['x'],
      activeValue: ['x'],
      operator: 'Exclude',
      activeOperator: 'Exclude'
    }
    TrainingLibraryNewLearningPathFilters.methods.handleClearFilter.call(
      { removeFilterFromPayload },
      filter
    )
    expect(filter.isFilterActive).toBe(false)
    expect(filter.value).toEqual([])
    expect(filter.operator).toBe('Include')
    expect(removeFilterFromPayload).toHaveBeenCalledWith(filter)
  })

  it('handleFilter activates and syncs filter', () => {
    const setFilterToPayload = jest.fn()
    const filter = { isFilterActive: false, value: 'v', operator: 'Contains' }
    TrainingLibraryNewLearningPathFilters.methods.handleFilter.call({ setFilterToPayload }, filter)
    expect(filter.isFilterActive).toBe(true)
    expect(filter.activeValue).toBe('v')
    expect(filter.activeOperator).toBe('Contains')
    expect(setFilterToPayload).toHaveBeenCalledWith(filter)
  })
})
