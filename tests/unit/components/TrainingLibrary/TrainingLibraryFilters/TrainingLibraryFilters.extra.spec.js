import TrainingLibraryFilters from '@/components/TrainingLibrary/TrainingLibraryFilters/TrainingLibraryFilters.vue'

describe('TrainingLibraryFilters.vue (extra)', () => {
  it('isFilterButtonDisabled handles select and long text filters', () => {
    expect(
      TrainingLibraryFilters.computed.isFilterButtonDisabled.call({
        activeFilter: { filterType: 'select', value: '' }
      })
    ).toBe(true)
    expect(
      TrainingLibraryFilters.computed.isFilterButtonDisabled.call({
        activeFilter: { filterType: 'select', value: 'Poster' }
      })
    ).toBe(false)
    expect(
      TrainingLibraryFilters.computed.isFilterButtonDisabled.call({
        activeFilter: { filterType: 'longTextSearch', value: ['text'] }
      })
    ).toBe(false)
  })

  it('renderKey watcher selects the first filter when filters exist', () => {
    const ctx = {
      filters: [{ key: 'type' }, { key: 'level' }],
      activeFilter: {}
    }

    TrainingLibraryFilters.watch.renderKey.call(ctx)

    expect(ctx.activeFilter).toEqual({ key: 'type' })
  })

  it('filterRenderKey watcher refreshes the current filter and updates activeFilter', () => {
    const checkFilter = jest.fn()
    const filter = { key: 'duration', value: '10' }
    const ctx = {
      filters: [filter],
      activeFilter: { key: 'duration' },
      checkFilter
    }

    TrainingLibraryFilters.watch.filterRenderKey.call(ctx)

    expect(checkFilter).toHaveBeenCalledWith(filter)
    expect(ctx.activeFilter).toBe(filter)
  })

  it('created hook activates the first filter when filters are present', () => {
    const handleSetActiveFilter = jest.fn()
    const filter = { key: 'language' }
    const ctx = {
      filters: [filter],
      handleSetActiveFilter
    }

    TrainingLibraryFilters.created.call(ctx)

    expect(handleSetActiveFilter).toHaveBeenCalledWith(filter)
  })

  it('handleSetActiveFilter returns early when selecting the active filter again', () => {
    const checkFilter = jest.fn()
    const filter = { key: 'language' }
    const ctx = {
      activeFilter: { key: 'language' },
      checkFilter
    }

    TrainingLibraryFilters.methods.handleSetActiveFilter.call(ctx, filter)

    expect(checkFilter).not.toHaveBeenCalled()
    expect(ctx.activeFilter).toEqual({ key: 'language' })
  })

  it('checkFilter hydrates active filters and resets inactive search filters', () => {
    const activeFilter = {
      isFilterActive: true,
      activeValue: 'Poster',
      activeOperator: 'Contains'
    }

    TrainingLibraryFilters.methods.checkFilter.call({}, activeFilter)
    expect(activeFilter.value).toBe('Poster')
    expect(activeFilter.operator).toBe('Contains')

    const inactiveSearchFilter = {
      isFilterActive: false,
      filterType: 'search',
      value: ['stale']
    }

    TrainingLibraryFilters.methods.checkFilter.call({}, inactiveSearchFilter)
    expect(inactiveSearchFilter.value).toEqual([])
  })

  it('handleClearFilter resets search and date filters with their default operators', () => {
    const removeFilterFromPayload = jest.fn()
    const searchFilter = {
      filterType: 'search',
      isFilterActive: true,
      value: ['abc'],
      activeValue: ['abc'],
      operator: 'Exclude',
      activeOperator: 'Exclude'
    }
    const dateFilter = {
      filterType: 'date',
      isFilterActive: true,
      value: '2026-01-01',
      activeValue: '2026-01-01',
      operator: 'between',
      activeOperator: 'between'
    }

    TrainingLibraryFilters.methods.handleClearFilter.call({ removeFilterFromPayload }, searchFilter)
    TrainingLibraryFilters.methods.handleClearFilter.call({ removeFilterFromPayload }, dateFilter)

    expect(searchFilter.value).toEqual([])
    expect(searchFilter.operator).toBe('Include')
    expect(dateFilter.value).toBe('')
    expect(dateFilter.operator).toBe('=')
    expect(removeFilterFromPayload).toHaveBeenCalledTimes(2)
  })

  it('handleFilter copies current values into active values and dispatches payload update', () => {
    const setFilterToPayload = jest.fn()
    const filter = {
      value: 'Poster',
      operator: 'Contains',
      isFilterActive: false
    }

    TrainingLibraryFilters.methods.handleFilter.call({ setFilterToPayload }, filter)

    expect(filter.isFilterActive).toBe(true)
    expect(filter.activeValue).toBe('Poster')
    expect(filter.activeOperator).toBe('Contains')
    expect(setFilterToPayload).toHaveBeenCalledWith(filter)
  })

  it('handleMenuVisibilityChange keeps the menu open while date pickers are visible', () => {
    const ctx = {
      activeFilter: { filterType: 'date' },
      isCloseOnClick: true,
      menu: false,
      $refs: {
        refDateFilter: { $refs: { refPicker: { pickerVisible: true }, refPicker2: null } },
        refMenu: { isActive: false }
      }
    }

    TrainingLibraryFilters.methods.handleMenuVisibilityChange.call(ctx, false)

    expect(ctx.isCloseOnClick).toBe(false)
    expect(ctx.menu).toBe(true)
    expect(ctx.$refs.refMenu.isActive).toBe(true)
  })

  it('handleMenuVisibilityChange closes normally and rechecks the active filter', () => {
    const checkFilter = jest.fn()
    const activeFilter = { filterType: 'select' }
    const ctx = {
      activeFilter,
      isCloseOnClick: false,
      menu: true,
      checkFilter,
      $refs: {
        refDateFilter: { $refs: {} },
        refMenu: { isActive: true }
      }
    }

    TrainingLibraryFilters.methods.handleMenuVisibilityChange.call(ctx, false)

    expect(ctx.isCloseOnClick).toBe(true)
    expect(ctx.menu).toBe(false)
    expect(checkFilter).toHaveBeenCalledWith(activeFilter)
  })

  it('handleDatePickerChange toggles close-on-click based on between operator', () => {
    const refMenu = { isActive: false }
    const betweenCtx = {
      activeFilter: { operator: 'between', value: '' },
      isCloseOnClick: true,
      menu: false,
      $refs: { refMenu }
    }

    TrainingLibraryFilters.methods.handleDatePickerChange.call(betweenCtx)
    expect(betweenCtx.isCloseOnClick).toBe(false)
    expect(betweenCtx.menu).toBe(true)
    expect(refMenu.isActive).toBe(true)

    const normalCtx = {
      activeFilter: { operator: '=', value: '2026-01-01' },
      isCloseOnClick: false,
      menu: false,
      $refs: { refMenu: { isActive: false } }
    }

    TrainingLibraryFilters.methods.handleDatePickerChange.call(normalCtx)
    expect(normalCtx.isCloseOnClick).toBe(true)
    expect(normalCtx.menu).toBe(true)
    expect(normalCtx.$refs.refMenu.isActive).toBe(true)
  })
})
