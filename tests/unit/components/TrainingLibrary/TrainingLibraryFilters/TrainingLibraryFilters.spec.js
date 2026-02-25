import TrainingLibraryFilters from '@/components/TrainingLibrary/TrainingLibraryFilters/TrainingLibraryFilters.vue'

describe('TrainingLibraryFilters.vue', () => {
  it('getTotalFilterLength returns count of visible filters', () => {
    const filters = [{ show: true }, { show: false }, { show: true }]
    expect(
      TrainingLibraryFilters.computed.getTotalFilterLength.call({ filters })
    ).toBe(2)
  })

  it('isFilterButtonDisabled returns true for search when value empty', () => {
    expect(
      TrainingLibraryFilters.computed.isFilterButtonDisabled.call({
        activeFilter: { filterType: 'search', value: [] }
      })
    ).toBe(true)
  })

  it('handleSetActiveFilter sets activeFilter', () => {
    const ctx = {
      activeFilter: {},
      checkFilter: TrainingLibraryFilters.methods.checkFilter
    }
    const filter = { key: 'type', text: 'Type' }
    TrainingLibraryFilters.methods.handleSetActiveFilter.call(ctx, filter)
    expect(ctx.activeFilter).toEqual(filter)
  })

  it('handleClearFilter resets filter', () => {
    const removeFilterFromPayload = jest.fn()
    const filter = {
      filterType: 'select',
      isFilterActive: true,
      value: 'x',
      activeValue: 'x'
    }
    TrainingLibraryFilters.methods.handleClearFilter.call(
      { removeFilterFromPayload },
      filter
    )
    expect(filter.isFilterActive).toBe(false)
    expect(filter.value).toBe('')
    expect(removeFilterFromPayload).toHaveBeenCalledWith(filter)
  })
})
