import DataTable from '@/components/DataTable.vue'

describe('DataTable.vue state/filter methods', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('initDefaultFilters restores saved filter payload and optional exam status', () => {
    localStorage.setItem(
      'dt-filters',
      JSON.stringify({
        filter: { FilterGroups: [{ FilterItems: [{ FieldName: 'Name', Value: 'alice' }] }] },
        search: 'alice',
        filterValues: { Name: 'alice' },
        showByExamStatus: 'FirstAttempt'
      })
    )

    const ctx = {
      savedFiltersLocalStorageKey: 'dt-filters',
      axiosPayload: {},
      isReportWithExam: true,
      search: '',
      filterValues: {},
      reRenderFilters: jest.fn(),
      $set: (obj, key, value) => {
        obj[key] = value
      }
    }

    DataTable.methods.initDefaultFilters.call(ctx)

    expect(ctx.axiosPayload.filter).toEqual({
      FilterGroups: [{ FilterItems: [{ FieldName: 'Name', Value: 'alice' }] }]
    })
    expect(ctx.axiosPayload.showByExamStatus).toBe('FirstAttempt')
    expect(ctx.search).toBe('alice')
    expect(ctx.filterValues).toEqual({ Name: 'alice' })
    expect(ctx.reRenderFilters).toHaveBeenCalledTimes(1)
  })

  it('initDefaultFilters exits safely when saved filter does not exist', () => {
    const ctx = {
      savedFiltersLocalStorageKey: 'missing-key',
      axiosPayload: {},
      isReportWithExam: false,
      reRenderFilters: jest.fn(),
      $set: jest.fn()
    }

    DataTable.methods.initDefaultFilters.call(ctx)

    expect(ctx.$set).not.toHaveBeenCalled()
    expect(ctx.reRenderFilters).not.toHaveBeenCalled()
  })

  it('handleRestoreDefaultSearch invokes init, emits event, and refreshes', () => {
    const emit = jest.fn()
    const ctx = {
      initDefaultFilters: jest.fn(),
      handleRefresh: jest.fn(),
      $emit: emit
    }

    DataTable.methods.handleRestoreDefaultSearch.call(ctx)

    expect(ctx.initDefaultFilters).toHaveBeenCalledTimes(1)
    expect(emit).toHaveBeenCalledWith('restore-default-search')
    expect(ctx.handleRefresh).toHaveBeenCalledTimes(1)
  })

  it('getState uses server page size for rowCount in server-side mode', () => {
    const ctx = {
      firstColFixed: true,
      lastColFixed: false,
      expandedRows: [{ id: 1 }],
      search: 'x',
      currentPage: 3,
      filteredDataLength: 5,
      showfilteredData: true,
      tableData: [{ id: 11 }],
      initialData: [{ id: 11 }, { id: 12 }],
      sortProps: { prop: 'name', order: 'ascending' },
      filteredData: [{ id: 11 }],
      filterValues: { Name: 'x' },
      selectedCluster: 'Department',
      rowCount: 10,
      isServerSide: true,
      serverSideProps: { pageSize: 25 },
      isSelectedAll: false,
      unRenderedFilterData: [],
      totalLength: 2,
      renderedColumns: ['name'],
      multipleSelection: [{ id: 11 }],
      serverSideSelectionCount: 1,
      isSelectedAllEver: false,
      excludedResourceIdList: ['a'],
      selectionRowCheckboxDeterminate: false
    }

    const result = DataTable.methods.getState.call(ctx)

    expect(result.rowCount).toBe(25)
    expect(result.search).toBe('x')
    expect(result.renderedColumns).toEqual(['name'])
  })

  it('getSelectedObjectAndSelectRowsByRowKey reselects by row key with fallback', () => {
    const clearSelection = jest.fn()
    const toggleRowSelection = jest.fn()
    const existing = { id: 1, name: 'exists' }
    const missing = { id: 99, name: 'missing' }
    const ctx = {
      multipleSelection: [existing, missing],
      rowKey: 'id',
      tableData: [{ id: 1, name: 'exists', extra: true }],
      $refs: { elTableRef: { clearSelection, toggleRowSelection } },
      $nextTick: (fn) => fn()
    }

    DataTable.methods.getSelectedObjectAndSelectRowsByRowKey.call(ctx, [existing, missing])

    expect(ctx.multipleSelection).toEqual([])
    expect(clearSelection).toHaveBeenCalledTimes(1)
    expect(toggleRowSelection).toHaveBeenCalledWith({ id: 1, name: 'exists', extra: true }, true)
    expect(toggleRowSelection).toHaveBeenCalledWith(missing, true)
  })

  it('setPersistentStateToDataValues applies column visibility and persisted selection', () => {
    const toggleRowSelection = jest.fn()
    localStorage.removeItem('dt-settings')
    const selectedRow = { id: 5 }
    const ctx = {
      persistentState: {
        renderedColumns: ['name'],
        multipleSelection: [selectedRow],
        firstColFixed: false,
        lastColFixed: false
      },
      columns: [
        { property: 'name', show: true, fixed: 'left' },
        { property: 'email', show: true }
      ],
      actionFixed: 'right',
      savedTableSettingsLocalStorageKey: 'dt-settings',
      storedTableSettings: null,
      setStoredTableSettings: jest.fn(),
      setRenderedColumns: jest.fn(),
      $refs: { elTableRef: { toggleRowSelection } },
      $nextTick: (fn) => fn()
    }

    DataTable.methods.setPersistentStateToDataValues.call(ctx)

    expect(ctx.columns[0].fixed).toBe(false)
    expect(ctx.actionFixed).toBe(false)
    expect(ctx.columns[1].show).toBe(false)
    expect(ctx.setStoredTableSettings).not.toHaveBeenCalled()
    expect(ctx.setRenderedColumns).not.toHaveBeenCalled()
    expect(toggleRowSelection).toHaveBeenCalledWith(selectedRow, true)
  })

  it('handleChangeVisibilityOfColumn triggers render/update/settings chain', () => {
    const ctx = {
      setRenderedColumns: jest.fn(),
      $forceUpdate: jest.fn(),
      handleTableSettingsChange: jest.fn()
    }

    DataTable.methods.handleChangeVisibilityOfColumn.call(ctx)

    expect(ctx.setRenderedColumns).toHaveBeenCalledTimes(1)
    expect(ctx.$forceUpdate).toHaveBeenCalledTimes(1)
    expect(ctx.handleTableSettingsChange).toHaveBeenCalledTimes(1)
  })
})
